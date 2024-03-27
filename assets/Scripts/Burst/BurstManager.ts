import {_decorator, UITransform} from 'cc'
import {ENTITY_STATE_ENUM, EVENT_ENUM} from '../../Enums'
import BurstStateMachine from './BurstStateMachine'
import EventManager from '../../Runtime/EventManager'
import DataManager from '../../Runtime/DataManager'
import EnemyManager from '../../Base/EnemyManager'
import {IEntity} from '../../Levels'
import {TILE_HEIGHT, TILE_WIDTH} from '../Tile/TileManager'

const {ccclass, property} = _decorator


@ccclass('BurstManager')
export default class BurstManager extends EnemyManager {

  async init(params: IEntity) {
    this.fsm = this.addComponent(BurstStateMachine)
    await this.fsm.init()
    super.init(params)
    const uiTransform = this.addComponent(UITransform)
    uiTransform.setContentSize(TILE_WIDTH, TILE_HEIGHT)
    EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onBurst, this)
  }

  onDestroy() {
    super.onDestroy()
    EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onBurst)
  }

  // protected update() {
  //   this.node.setPosition(TILE_WIDTH * this.x, -TILE_HEIGHT * this.y)
  // }


  private onBurst() {
    if (this.state === ENTITY_STATE_ENUM.DEATH || !DataManager.Instance.player) {
      return
    }
    const {x: playerX, y: playerY, state: playerState} = DataManager.Instance.player
    // 当玩家在敌人周围时,进行攻击
    if (this.x === playerX && this.y === playerY && this.state === ENTITY_STATE_ENUM.IDLE) {
      this.state = ENTITY_STATE_ENUM.ATTACK
    } else if (this.state === ENTITY_STATE_ENUM.ATTACK) {
      this.state = ENTITY_STATE_ENUM.DEATH
      if (this.x === playerX && this.y === playerY) {
        EventManager.Instance.emit(EVENT_ENUM.ATTACK_PLAYER, ENTITY_STATE_ENUM.AIR_DEATH)
      }
    }
  }

}


