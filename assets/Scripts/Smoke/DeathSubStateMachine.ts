import {DIRECTION_ENUM} from '../../Enums'
import State from '../../Base/State'
import DirectionSubStateMachine from '../../Base/DirectionSubStateMachine'
import StateMachine from '../../Base/StateMachine'


const BASE_URL = '/texture/door/death'

export default class DeathSubStateMachine extends DirectionSubStateMachine {
  constructor(public fsm: StateMachine) {
    super(fsm)
    const state = new State(fsm, `${BASE_URL}`)
    this.stateMachines.set(DIRECTION_ENUM.TOP, state)
    this.stateMachines.set(DIRECTION_ENUM.BOTTOM, state)
    this.stateMachines.set(DIRECTION_ENUM.LEFT, state)
    this.stateMachines.set(DIRECTION_ENUM.RIGHT, state)
  }
}
