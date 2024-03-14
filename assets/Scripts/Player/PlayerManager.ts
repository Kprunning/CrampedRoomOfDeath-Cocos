import {_decorator} from 'cc'
import {CTRL_DIRECTION_ENUM, DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM} from '../../Enums'
import EventManager from '../../Runtime/EventManager'
import {PlayerStateMachine} from './PlayerStateMachine'
import EntityManager from '../../Base/EntityManager'
import DataManager from '../../Runtime/DataManager'

const {ccclass, property} = _decorator


@ccclass('PlayerManager')
export class PlayerManager extends EntityManager {
  targetX = 0
  targetY = 0
  private readonly speed = 1 / 10


  async init() {
    this.fsm = this.addComponent(PlayerStateMachine)
    await this.fsm.init()
    super.init({
      x: 0,
      y: 0,
      type: ENTITY_TYPE_ENUM.PLAYER,
      direction: DIRECTION_ENUM.TOP,
      state: ENTITY_STATE_ENUM.IDLE
    })
    EventManager.Instance.on(EVENT_ENUM.CTRL_DIRECTION, this.move, this)
  }

  protected onDestroy() {
    EventManager.Instance.off(EVENT_ENUM.CTRL_DIRECTION, this.move)
  }

  update() {
    this.updateXY()
    super.update()
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
      case CTRL_DIRECTION_ENUM.TURN_RIGHT:
        if (this.direction === DIRECTION_ENUM.TOP) {
          this.direction = DIRECTION_ENUM.RIGHT
        } else if (this.direction === DIRECTION_ENUM.LEFT) {
          this.direction = DIRECTION_ENUM.TOP
        } else if (this.direction === DIRECTION_ENUM.BOTTOM) {
          this.direction = DIRECTION_ENUM.LEFT
        } else if (this.direction === DIRECTION_ENUM.RIGHT) {
          this.direction = DIRECTION_ENUM.BOTTOM
        }
        this.state = ENTITY_STATE_ENUM.TURN_RIGHT
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


