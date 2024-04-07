import {_decorator} from 'cc'
import SmokeStateMachine from './SmokeStateMachine'
import EnemyManager from '../../Base/EnemyManager'
import {IEntity} from '../../Levels'

const {ccclass, property} = _decorator


@ccclass('SmokeManager')
export default class SmokeManager extends EnemyManager {

  async init(params: IEntity) {
    this.fsm = this.addComponent(SmokeStateMachine)
    await this.fsm.init()
    super.init(params)
  }
}


