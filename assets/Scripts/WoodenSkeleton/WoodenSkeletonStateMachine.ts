import {_decorator, Animation} from 'cc'
import {PARAMS_NAME_ENUM} from '../../Enums'
import StateMachine, {getInitParamsTrigger} from '../../Base/StateMachine'
import IdleSubStateMachine from './IdleSubStateMachine'

const {ccclass, property} = _decorator


@ccclass('WoodenSkeletonStateMachine')
export default class WoodenSkeletonStateMachine extends StateMachine {

  async init() {
    this.animationComponent = this.addComponent(Animation)
    this.initParams()
    this.initStateMachines()
    await Promise.all(this.waitingList)
  }

  private initParams() {
    this.params.set(PARAMS_NAME_ENUM.IDLE, getInitParamsTrigger())
  }

  private initStateMachines() {
    this.stateMachines.set(PARAMS_NAME_ENUM.IDLE, new IdleSubStateMachine(this))
  }


  run() {
    switch (this.currentState) {
      case this.stateMachines.get(PARAMS_NAME_ENUM.IDLE):
        if (this.params.get(PARAMS_NAME_ENUM.IDLE).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
        } else {
          this.currentState = this.currentState
        }
        break
      default:
        this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
    }
  }
}


