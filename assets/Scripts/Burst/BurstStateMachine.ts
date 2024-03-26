import {_decorator, Animation} from 'cc'
import {PARAMS_NAME_ENUM} from '../../Enums'
import StateMachine, {getInitParamsTrigger} from '../../Base/StateMachine'
import State from '../../Base/State'

const {ccclass, property} = _decorator


@ccclass('BurstStateMachine')
export default class BurstStateMachine extends StateMachine {

  async init() {
    this.animationComponent = this.addComponent(Animation)
    this.initParams()
    this.initStateMachines()
    await Promise.all(this.waitingList)
  }

  private initParams() {
    this.params.set(PARAMS_NAME_ENUM.IDLE, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.ATTACK, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.DEATH, getInitParamsTrigger())
  }

  private initStateMachines() {
    const BASE_URL = '/texture/burst'
    this.stateMachines.set(PARAMS_NAME_ENUM.IDLE, new State(this, `${BASE_URL}/idle`))
    this.stateMachines.set(PARAMS_NAME_ENUM.ATTACK, new State(this, `${BASE_URL}/attack`))
    this.stateMachines.set(PARAMS_NAME_ENUM.DEATH, new State(this, `${BASE_URL}/death`))
  }

  run() {
    switch (this.currentState) {
      case this.stateMachines.get(PARAMS_NAME_ENUM.IDLE):
      case this.stateMachines.get(PARAMS_NAME_ENUM.ATTACK):
      case this.stateMachines.get(PARAMS_NAME_ENUM.DEATH):
        if (this.params.get(PARAMS_NAME_ENUM.IDLE).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
        } else if (this.params.get(PARAMS_NAME_ENUM.ATTACK).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.ATTACK)
        } else if (this.params.get(PARAMS_NAME_ENUM.DEATH).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.DEATH)
        } else {
          this.currentState = this.currentState
        }
        break
      default:
        this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
    }
  }
}


