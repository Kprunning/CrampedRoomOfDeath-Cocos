import {_decorator} from 'cc'
import {AUDIO_NAME_ENUM, ENTITY_STATE_ENUM, EVENT_ENUM} from '../../Enums'
import WoodenSkeletonStateMachine from './WoodenSkeletonStateMachine'
import EventManager from '../../Runtime/EventManager'
import DataManager from '../../Runtime/DataManager'
import EnemyManager from '../../Base/EnemyManager'
import {IEntity} from '../../Levels'

const {ccclass, property} = _decorator


@ccclass('WoodenSkeletonManager')
export default class WoodenSkeletonManager extends EnemyManager {

  async init(params: IEntity) {
    this.fsm = this.addComponent(WoodenSkeletonStateMachine)
    await this.fsm.init()
    super.init(params)
    EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onAttack, this)
  }

  onDestroy() {
    super.onDestroy()
    EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onAttack)
  }


  private onAttack() {
    if (this.state === ENTITY_STATE_ENUM.DEATH || !DataManager.Instance.player) {
      return
    }
    const {x: playerX, y: playerY, state: playerState} = DataManager.Instance.player
    // 当玩家在敌人周围时,进行攻击
    if (((this.x === playerX && Math.abs(playerY - this.y) <= 1) || (this.y === playerY && Math.abs(playerX - this.x) <= 1))
      && (playerState !== ENTITY_STATE_ENUM.DEATH && playerState !== ENTITY_STATE_ENUM.AIR_DEATH)) {
      this.state = ENTITY_STATE_ENUM.ATTACK
      EventManager.Instance.emit(EVENT_ENUM.PLAY_AUDIO, AUDIO_NAME_ENUM.WOODEN_SKELETON_ATTACK)
      EventManager.Instance.emit(EVENT_ENUM.ATTACK_PLAYER, ENTITY_STATE_ENUM.DEATH)
    } else {
      this.state = ENTITY_STATE_ENUM.IDLE
    }
  }

}


