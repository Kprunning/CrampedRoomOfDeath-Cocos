import {_decorator} from 'cc'
import {DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM} from '../../Enums'
import EntityManager from '../../Base/EntityManager'
import WoodenSkeletonStateMachine from './WoodenSkeletonStateMachine'

const {ccclass, property} = _decorator


@ccclass('WoodenSkeletonManager')
export default class WoodenSkeletonManager extends EntityManager {

  async init() {
    this.fsm = this.addComponent(WoodenSkeletonStateMachine)
    await this.fsm.init()
    super.init({
      x: 7,
      y: 7,
      type: ENTITY_TYPE_ENUM.ENEMY,
      direction: DIRECTION_ENUM.TOP,
      state: ENTITY_STATE_ENUM.IDLE
    })
  }
}


