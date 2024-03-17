import {FSM_PARAMS_TYPE_ENUM} from '../Enums'
import State from './State'
import StateMachine from './StateMachine'


export default abstract class SubStateMachine {
  private _currentState: State = null
  stateMachines: Map<string, State> = new Map<string, State>()

  protected constructor(public fsm: StateMachine) {
  }


  get currentState(): State {
    return this._currentState
  }

  set currentState(value: State) {
    this._currentState = value
    this._currentState.run()
  }


  abstract run(): void

}


