import {_decorator} from 'cc'
import IronSkeletonStateMachine from './IronSkeletonStateMachine'
import EnemyManager from '../../Base/EnemyManager'
import {IEntity} from '../../Levels'

const {ccclass, property} = _decorator


@ccclass('IronSkeletonManager')
export default class IronSkeletonManager extends EnemyManager {

  async init(params: IEntity) {
    this.fsm = this.addComponent(IronSkeletonStateMachine)
    await this.fsm.init()
    super.init(params)
  }
}


