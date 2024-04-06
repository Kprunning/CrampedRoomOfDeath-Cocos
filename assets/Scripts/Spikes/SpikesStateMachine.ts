import {_decorator, Animation} from 'cc'
import {ENTITY_TYPE_ENUM, PARAMS_NAME_ENUM, SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM} from '../../Enums'
import StateMachine, {getInitParamsNumber} from '../../Base/StateMachine'
import SpikesSubStateMachine from './SpikesSubStateMachine'
import SpikesManager from './SpikesManager'

const {ccclass, property} = _decorator


@ccclass('SpikesStateMachine')
export class SpikesStateMachine extends StateMachine {

  async init() {
    this.animationComponent = this.addComponent(Animation)
    this.initParams()
    this.initStateMachines()
    this.initAnimationComponent()
    await Promise.all(this.waitingList)
  }

  private initParams() {
    this.params.set(PARAMS_NAME_ENUM.SPIKES_CUR_COUNT, getInitParamsNumber())
    this.params.set(PARAMS_NAME_ENUM.SPIKES_TOTAL_COUNT, getInitParamsNumber())
  }

  private initStateMachines() {
    this.stateMachines.set(ENTITY_TYPE_ENUM.SPIKES_ONE, new SpikesSubStateMachine(this, ENTITY_TYPE_ENUM.SPIKES_ONE))
    this.stateMachines.set(ENTITY_TYPE_ENUM.SPIKES_TWO, new SpikesSubStateMachine(this, ENTITY_TYPE_ENUM.SPIKES_TWO))
    this.stateMachines.set(ENTITY_TYPE_ENUM.SPIKES_THREE, new SpikesSubStateMachine(this, ENTITY_TYPE_ENUM.SPIKES_THREE))
    this.stateMachines.set(ENTITY_TYPE_ENUM.SPIKES_FOUR, new SpikesSubStateMachine(this, ENTITY_TYPE_ENUM.SPIKES_FOUR))
  }

  private initAnimationComponent() {
    this.animationComponent.on(Animation.EventType.FINISHED, () => {
      const name = this.animationComponent.defaultClip.name
      const val = this.getParams(PARAMS_NAME_ENUM.SPIKES_TOTAL_COUNT)
      if (
        (val === SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM.SPIKES_ONE && name.includes('spikesone/two')) ||
        (val === SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM.SPIKES_TWO && name.includes('spikestwo/three')) ||
        (val === SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM.SPIKES_THREE && name.includes('spikesthree/four')) ||
        (val === SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM.SPIKES_FOUR && name.includes('spikesfour/five'))
      ) {
        this.node.getComponent(SpikesManager).backZero()
      }
    })
  }

  run() {
    const val = this.getParams(PARAMS_NAME_ENUM.SPIKES_TOTAL_COUNT)
    switch (this.currentState) {
      case this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_ONE):
      case this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_TWO):
      case this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_THREE):
      case this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_FOUR):
        if (val === SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM[ENTITY_TYPE_ENUM.SPIKES_ONE]) {
          this.currentState = this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_ONE)
        } else if (val === SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM[ENTITY_TYPE_ENUM.SPIKES_TWO]) {
          this.currentState = this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_TWO)
        } else if (val === SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM[ENTITY_TYPE_ENUM.SPIKES_THREE]) {
          this.currentState = this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_THREE)
        } else if (val === SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM[ENTITY_TYPE_ENUM.SPIKES_FOUR]) {
          this.currentState = this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_FOUR)
        } else {
          this.currentState = this.currentState
        }
        break
      default:
        this.currentState = this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_ONE)
    }
  }
}


