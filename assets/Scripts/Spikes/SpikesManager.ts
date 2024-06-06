import {_decorator, Component, Sprite, UITransform} from 'cc'
import {ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM, PARAMS_NAME_ENUM, SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM} from '../../Enums'
import StateMachine from '../../Base/StateMachine'
import {ISpikes} from '../../Levels'
import {TILE_HEIGHT, TILE_WIDTH} from '../Tile/TileManager'
import {generateUUID} from '../../Utils'
import {SpikesStateMachine} from './SpikesStateMachine'
import EventManager from '../../Runtime/EventManager'
import DataManager from '../../Runtime/DataManager'

const {ccclass, property} = _decorator


@ccclass('SpikesManager')
export default class SpikesManager extends Component {
  id: string = generateUUID(8, 16)
  x = 0
  y = 0
  type: ENTITY_TYPE_ENUM
  fsm: StateMachine = null
  private _count: number = 0
  private _totalCount: number = 0


  get count(): number {
    return this._count
  }

  set count(value: number) {
    this._count = value
    this.fsm.setParams(PARAMS_NAME_ENUM.SPIKES_CUR_COUNT, value)
  }

  get totalCount(): number {
    return this._totalCount
  }

  set totalCount(value: number) {
    this._totalCount = value
    this.fsm.setParams(PARAMS_NAME_ENUM.SPIKES_TOTAL_COUNT, value)
  }


  async init(params: ISpikes) {
    const sprite = this.addComponent(Sprite)
    // 自定义大小
    sprite.sizeMode = Sprite.SizeMode.CUSTOM
    const uiTransform = this.addComponent(UITransform)
    uiTransform.setContentSize(TILE_WIDTH * 4, TILE_HEIGHT * 4)

    this.fsm = this.addComponent(SpikesStateMachine)
    await this.fsm.init()

    this.x = params.x
    this.y = params.y
    this.type = params.type
    this.count = params.count
    this.totalCount = SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM[params.type]

    EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onLoop, this)
  }

  private onLoop() {
    if (this.count === this.totalCount) {
      this.count = 1
    } else {
      this.count++
    }

    this.onAttack()
  }

  backZero() {
    this.count = 0
  }


  protected update() {
    this.node.setPosition(TILE_WIDTH * this.x + 0.5 * TILE_WIDTH, -TILE_HEIGHT * this.y - 0.5 * TILE_HEIGHT)
  }

  protected onDestroy() {
    EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onLoop)
  }

  private onAttack() {
    const player = DataManager.Instance.player
    if (!player) {
      return
    }
    const {x: playerX, y: playerY} = player
    if (this.x === playerX && this.y === playerY && this.count === this.totalCount) {
      EventManager.Instance.emit(EVENT_ENUM.ATTACK_PLAYER, ENTITY_STATE_ENUM.DEATH)
    }
  }
}


