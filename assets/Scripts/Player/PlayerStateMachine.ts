import {_decorator, Animation} from 'cc'
import {ENTITY_STATE_ENUM, PARAMS_NAME_ENUM} from '../../Enums'
import StateMachine, {getInitParamsNumber, getInitParamsTrigger} from '../../Base/StateMachine'
import IdleSubStateMachine from './IdleSubStateMachine'
import TurnSubStateMachine from './TurnSubStateMachine'
import BlockSubStateMachine from './BlockSubStateMachine'
import EntityManager from '../../Base/EntityManager'

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
    this.params.set(PARAMS_NAME_ENUM.TURN_RIGHT, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.DIRECTION, getInitParamsNumber())
    this.params.set(PARAMS_NAME_ENUM.BLOCK_RIGHT, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.BLOCK_LEFT, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.BLOCK_FRONT, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.BLOCK_BACK, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.BLOCK_TURN_RIGHT, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.BLOCK_TURN_LEFT, getInitParamsTrigger())
  }

  private initStateMachines() {
    this.stateMachines.set(PARAMS_NAME_ENUM.IDLE, new IdleSubStateMachine(this))
    this.stateMachines.set(PARAMS_NAME_ENUM.TURN_LEFT, new TurnSubStateMachine(this, 'left'))
    this.stateMachines.set(PARAMS_NAME_ENUM.TURN_RIGHT, new TurnSubStateMachine(this, 'right'))
    this.stateMachines.set(PARAMS_NAME_ENUM.BLOCK_RIGHT, new BlockSubStateMachine(this, 'right'))
    this.stateMachines.set(PARAMS_NAME_ENUM.BLOCK_LEFT, new BlockSubStateMachine(this, 'left'))
    this.stateMachines.set(PARAMS_NAME_ENUM.BLOCK_FRONT, new BlockSubStateMachine(this, 'front'))
    this.stateMachines.set(PARAMS_NAME_ENUM.BLOCK_BACK, new BlockSubStateMachine(this, 'back'))
    this.stateMachines.set(PARAMS_NAME_ENUM.BLOCK_TURN_RIGHT, new BlockSubStateMachine(this, 'turnright'))
    this.stateMachines.set(PARAMS_NAME_ENUM.BLOCK_TURN_LEFT, new BlockSubStateMachine(this, 'turnleft'))
  }

  private initAnimationComponent() {
    this.animationComponent.on(Animation.EventType.FINISHED, () => {
      const name = this.animationComponent.defaultClip.name
      const whiteList = ['turn', 'block']
      if (whiteList.some(item => name.includes(item))) {
        this.node.getComponent(EntityManager).state = ENTITY_STATE_ENUM.IDLE
      }
    })
  }

  run() {
    switch (this.currentState) {
      case this.stateMachines.get(PARAMS_NAME_ENUM.TURN_LEFT):
      case this.stateMachines.get(PARAMS_NAME_ENUM.TURN_RIGHT):
      case this.stateMachines.get(PARAMS_NAME_ENUM.IDLE):
      case this.stateMachines.get(PARAMS_NAME_ENUM.BLOCK_TURN_LEFT):
      case this.stateMachines.get(PARAMS_NAME_ENUM.BLOCK_TURN_RIGHT):
      case this.stateMachines.get(PARAMS_NAME_ENUM.BLOCK_BACK):
      case this.stateMachines.get(PARAMS_NAME_ENUM.BLOCK_FRONT):
      case this.stateMachines.get(PARAMS_NAME_ENUM.BLOCK_LEFT):
      case this.stateMachines.get(PARAMS_NAME_ENUM.BLOCK_RIGHT):
        if (this.params.get(PARAMS_NAME_ENUM.BLOCK_TURN_LEFT).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.BLOCK_TURN_LEFT)
        } else if (this.params.get(PARAMS_NAME_ENUM.BLOCK_TURN_RIGHT).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.BLOCK_TURN_RIGHT)
        } else if (this.params.get(PARAMS_NAME_ENUM.BLOCK_BACK).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.BLOCK_BACK)
        } else if (this.params.get(PARAMS_NAME_ENUM.BLOCK_FRONT).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.BLOCK_FRONT)
        } else if (this.params.get(PARAMS_NAME_ENUM.BLOCK_LEFT).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.BLOCK_LEFT)
        } else if (this.params.get(PARAMS_NAME_ENUM.BLOCK_RIGHT).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.BLOCK_RIGHT)
        } else if (this.params.get(PARAMS_NAME_ENUM.TURN_LEFT).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.TURN_LEFT)
        } else if (this.params.get(PARAMS_NAME_ENUM.TURN_RIGHT).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.TURN_RIGHT)
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


