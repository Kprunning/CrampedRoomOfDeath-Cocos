import {_decorator, Animation} from 'cc'
import {PARAMS_NAME_ENUM} from '../../Enums'
import StateMachine, {getInitParamsNumber, getInitParamsTrigger} from '../../Base/StateMachine'
import IdleSubStateMachine from './IdleSubStateMachine'
import TurnSubStateMachine from './TurnSubStateMachine'

const {ccclass, property} = _decorator


@ccclass('PlayerStateMachine')
export class PlayerStateMachine extends StateMachine {

  async init() {
    this.animationComponent = this.addComponent(Animation)
    this.initParams()
    this.initStateMachines()
    this.initAnimationComponent()
    await Promise.all(this.waitingList)
  }

  private initParams() {
    this.params.set(PARAMS_NAME_ENUM.IDLE, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.TURN_LEFT, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.DIRECTION, getInitParamsNumber())
  }

  private initStateMachines() {
    this.stateMachines.set(PARAMS_NAME_ENUM.IDLE, new IdleSubStateMachine(this))
    this.stateMachines.set(PARAMS_NAME_ENUM.TURN_LEFT, new TurnSubStateMachine(this, 'left'))
    this.stateMachines.set(PARAMS_NAME_ENUM.TURN_RIGHT, new TurnSubStateMachine(this, 'right'))
  }

  private initAnimationComponent() {
    this.animationComponent.on(Animation.EventType.FINISHED, () => {
      const name = this.animationComponent.defaultClip.name
      const whiteList = ['turn']
      if (whiteList.some(item => name.includes(item))) {
        this.setParams(PARAMS_NAME_ENUM.IDLE, true)
      }
    })
  }

  run() {
    switch (this.currentState) {
      case this.stateMachines.get(PARAMS_NAME_ENUM.TURN_LEFT):
      case this.stateMachines.get(PARAMS_NAME_ENUM.IDLE):
        if (this.params.get(PARAMS_NAME_ENUM.TURN_LEFT).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.TURN_LEFT)
        } else if (this.params.get(PARAMS_NAME_ENUM.IDLE).value) {
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


