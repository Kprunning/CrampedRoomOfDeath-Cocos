import {_decorator, Component, Sprite, UITransform} from 'cc'
import {TILE_HEIGHT, TILE_WIDTH} from '../Tile/TileManager'
import {CTRL_DIRECTION_ENUM, DIRECTION_ENUM, DIRECTION_ORDER_ENUM, ENTITY_STATE_ENUM, EVENT_ENUM, PARAMS_NAME_ENUM} from '../../Enums'
import EventManager from '../../Runtime/EventManager'
import {PlayerStateMachine} from './PlayerStateMachine'

const {ccclass, property} = _decorator


@ccclass('PlayerManager')
export class PlayerManager extends Component {

  x = 0
  y = 0
  targetX = 0
  targetY = 0
  private readonly speed = 1 / 10
  fsm: PlayerStateMachine = null

  private _direction: DIRECTION_ENUM
  private _state: ENTITY_STATE_ENUM


  get state(): ENTITY_STATE_ENUM {
    return this._state
  }

  set state(value: ENTITY_STATE_ENUM) {
    this._state = value
    this.fsm.setParams(this._state, true)
  }

  get direction(): DIRECTION_ENUM {
    return this._direction
  }

  set direction(value: DIRECTION_ENUM) {
    this._direction = value
    this.fsm.setParams(PARAMS_NAME_ENUM.DIRECTION, DIRECTION_ORDER_ENUM[this._direction])
  }

  async init() {
    const sprite = this.addComponent(Sprite)
    // 自定义大小
    sprite.sizeMode = Sprite.SizeMode.CUSTOM
    const uiTransform = this.addComponent(UITransform)
    uiTransform.setContentSize(TILE_WIDTH * 4, TILE_HEIGHT * 4)

    this.fsm = this.addComponent(PlayerStateMachine)
    await this.fsm.init()
    this.state = ENTITY_STATE_ENUM.IDLE
    this.direction = DIRECTION_ENUM.TOP

    EventManager.Instance.on(EVENT_ENUM.CTRL_DIRECTION, this.move, this)
  }

  protected onDestroy() {
    EventManager.Instance.off(EVENT_ENUM.CTRL_DIRECTION, this.move)
  }

  protected update(dt: number) {
    this.updateXY()
    this.node.setPosition(TILE_WIDTH * this.x + 1.5 * TILE_WIDTH, TILE_HEIGHT * this.y - 1.5 * TILE_HEIGHT)
  }

  move(ctrlDirection: CTRL_DIRECTION_ENUM) {
    switch (ctrlDirection) {
      case CTRL_DIRECTION_ENUM.BOTTOM:
        this.targetY--
        break
      case CTRL_DIRECTION_ENUM.TOP:
        this.targetY++
        break
      case CTRL_DIRECTION_ENUM.LEFT:
        this.targetX--
        break
      case CTRL_DIRECTION_ENUM.RIGHT:
        this.targetX++
        break
      case CTRL_DIRECTION_ENUM.TURN_LEFT:
        if (this.direction === DIRECTION_ENUM.TOP) {
          this.direction = DIRECTION_ENUM.LEFT
        } else if (this.direction === DIRECTION_ENUM.LEFT) {
          this.direction = DIRECTION_ENUM.BOTTOM
        } else if (this.direction === DIRECTION_ENUM.BOTTOM) {
          this.direction = DIRECTION_ENUM.RIGHT
        } else if (this.direction === DIRECTION_ENUM.RIGHT) {
          this.direction = DIRECTION_ENUM.TOP
        }
        this.state = ENTITY_STATE_ENUM.TURN_LEFT
        break
    }
  }

  updateXY() {
    if (this.x < this.targetX) {
      this.x += this.speed
    } else if (this.x > this.targetX) {
      this.x -= this.speed
    } else if (this.y < this.targetY) {
      this.y += this.speed
    } else if (this.y > this.targetY) {
      this.y -= this.speed
    }
    // 防止鬼畜乱动
    if (Math.abs(this.x - this.targetX) <= 0.1) {
      this.x = this.targetX
    }
    if (Math.abs(this.y - this.targetY) <= 0.1) {
      this.y = this.targetY
    }
  }
}


