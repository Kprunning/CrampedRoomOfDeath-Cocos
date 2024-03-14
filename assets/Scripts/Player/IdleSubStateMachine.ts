import {DIRECTION_ENUM} from '../../Enums'
import State from '../../Base/State'
import {AnimationClip} from 'cc'
import DirectionSubStateMachine from '../../Base/DirectionSubStateMachine'
import StateMachine from '../../Base/StateMachine'


const BASE_URL = '/texture/player/idle'

export default class IdleSubStateMachine extends DirectionSubStateMachine {
  constructor(public fsm: StateMachine) {
    super(fsm)
    this.stateMachines.set(DIRECTION_ENUM.TOP, new State(fsm, `${BASE_URL}/top`, AnimationClip.WrapMode.Loop))
    this.stateMachines.set(DIRECTION_ENUM.BOTTOM, new State(fsm, `${BASE_URL}/bottom`, AnimationClip.WrapMode.Loop))
    this.stateMachines.set(DIRECTION_ENUM.LEFT, new State(fsm, `${BASE_URL}/left`, AnimationClip.WrapMode.Loop))
    this.stateMachines.set(DIRECTION_ENUM.RIGHT, new State(fsm, `${BASE_URL}/right`, AnimationClip.WrapMode.Loop))
  }
}
