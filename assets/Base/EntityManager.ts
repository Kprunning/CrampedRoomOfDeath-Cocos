import {_decorator, Component, Sprite, UITransform} from 'cc'
import {DIRECTION_ENUM, DIRECTION_ORDER_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, PARAMS_NAME_ENUM} from '../Enums'
import {TILE_HEIGHT, TILE_WIDTH} from '../Scripts/Tile/TileManager'
import {IEntity} from '../Levels'
import StateMachine from './StateMachine'
import {generateUUID} from '../Utils'

const {ccclass, property} = _decorator


@ccclass('EntityManager')
export default class EntityManager extends Component {
  id: string = generateUUID(8, 16)
  x = 0
  y = 0
  type: ENTITY_TYPE_ENUM
  fsm: StateMachine = null

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
    const {DIRECTION} = PARAMS_NAME_ENUM
    this.fsm.setParams(DIRECTION, DIRECTION_ORDER_ENUM[this._direction])
  }

  init(params: IEntity) {
    const sprite = this.addComponent(Sprite)
    // 自定义大小
    sprite.sizeMode = Sprite.SizeMode.CUSTOM
    const uiTransform = this.addComponent(UITransform)
    uiTransform.setContentSize(TILE_WIDTH * 4, TILE_HEIGHT * 4)
    this.state = params.state
    this.direction = params.direction
    this.x = params.x
    this.y = params.y
    this.type = params.type
  }


  protected update() {
    this.node.setPosition(TILE_WIDTH * this.x + 0.5 * TILE_WIDTH, -TILE_HEIGHT * this.y - 0.5 * TILE_HEIGHT)
  }

  protected onDestroy() {
  }

}


