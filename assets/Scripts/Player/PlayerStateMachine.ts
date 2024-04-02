import {_decorator, Animation} from 'cc'
import {ENTITY_STATE_ENUM, PARAMS_NAME_ENUM} from '../../Enums'
import StateMachine, {getInitParamsNumber, getInitParamsTrigger} from '../../Base/StateMachine'
import IdleSubStateMachine from './IdleSubStateMachine'
import TurnSubStateMachine from './TurnSubStateMachine'
import BlockSubStateMachine from './BlockSubStateMachine'
import EntityManager from '../../Base/EntityManager'
import DeathSubStateMachine from './DeathSubStateMachine'
import AttackSubStateMachine from './AttackSubStateMachine'
import DataManager from '../../Runtime/DataManager'
import AirDeathSubStateMachine from './AirDeathSubStateMachine'

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
    this.params.set(PARAMS_NAME_ENUM.DEATH, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.AIR_DEATH, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.ATTACK, getInitParamsTrigger())
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
    this.stateMachines.set(PARAMS_NAME_ENUM.DEATH, new DeathSubStateMachine(this))
    this.stateMachines.set(PARAMS_NAME_ENUM.AIR_DEATH, new AirDeathSubStateMachine(this))
    this.stateMachines.set(PARAMS_NAME_ENUM.ATTACK, new AttackSubStateMachine(this))
  }

  private initAnimationComponent() {
    this.animationComponent.on(Animation.EventType.FINISHED, () => {
      const name = this.animationComponent.defaultClip.name
      const whiteList = ['turn', 'block', 'attack']
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
      case this.stateMachines.get(PARAMS_NAME_ENUM.DEATH):
      case this.stateMachines.get(PARAMS_NAME_ENUM.AIR_DEATH):
      case this.stateMachines.get(PARAMS_NAME_ENUM.ATTACK):
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
        } else if (this.params.get(PARAMS_NAME_ENUM.DEATH).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.DEATH)
        } else if (this.params.get(PARAMS_NAME_ENUM.AIR_DEATH).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.AIR_DEATH)
        } else if (this.params.get(PARAMS_NAME_ENUM.IDLE).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
        } else if (this.params.get(PARAMS_NAME_ENUM.ATTACK).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.ATTACK)
        } else {
          this.currentState = this.currentState
        }
        break
      default:
        this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
    }
  }
}


