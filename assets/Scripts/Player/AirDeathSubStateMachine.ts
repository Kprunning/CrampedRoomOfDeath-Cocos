import {DIRECTION_ENUM} from '../../Enums'
import State from '../../Base/State'
import DirectionSubStateMachine from '../../Base/DirectionSubStateMachine'
import StateMachine from '../../Base/StateMachine'


const BASE_URL = '/texture/player/airdeath'

export default class AirDeathSubStateMachine extends DirectionSubStateMachine {
  constructor(public fsm: StateMachine) {
    super(fsm)
    this.stateMachines.set(DIRECTION_ENUM.TOP, new State(fsm, `${BASE_URL}/top`))
    this.stateMachines.set(DIRECTION_ENUM.BOTTOM, new State(fsm, `${BASE_URL}/bottom`))
    this.stateMachines.set(DIRECTION_ENUM.LEFT, new State(fsm, `${BASE_URL}/left`))
    this.stateMachines.set(DIRECTION_ENUM.RIGHT, new State(fsm, `${BASE_URL}/right`))
  }
}
