import {_decorator, Animation, Component, SpriteFrame} from 'cc'
import {FSM_PARAMS_TYPE_ENUM} from '../Enums'
import State from './State'
import SubStateMachine from './SubStateMachine'

const {ccclass, property} = _decorator

type ParamsValueType = boolean | number

interface IParamsValue {
  type: FSM_PARAMS_TYPE_ENUM
  value: ParamsValueType
}


export function getInitParamsTrigger() {
  return {type: FSM_PARAMS_TYPE_ENUM.TRIGGER, value: false}
}


export function getInitParamsNumber() {
  return {type: FSM_PARAMS_TYPE_ENUM.NUMBER, value: 0}
}


@ccclass('StateMachine')
export abstract class StateMachine extends Component {
  private _currentState: State | SubStateMachine = null
  params: Map<string, IParamsValue> = new Map<string, IParamsValue>()
  stateMachines: Map<string, State | SubStateMachine> = new Map<string, State | SubStateMachine>()
  animationComponent: Animation
  waitingList: Array<Promise<SpriteFrame[]>> = []


  getParams(paramsName: string) {
    if (this.params.has(paramsName)) {
      return this.params.get(paramsName).value
    }
  }

  setParams(paramsName: string, value: ParamsValueType) {
    if (this.params.has(paramsName)) {
      this.params.get(paramsName).value = value
      this.run()
      this.resetTrigger()
    }
  }

  get currentState(): State | SubStateMachine {
    return this._currentState
  }

  set currentState(value: State | SubStateMachine) {
    this._currentState = value
    this._currentState.run()
  }


  // 重置触发器为为未触发状态
  private resetTrigger() {
    this.params.forEach(value => {
      if (value.type === FSM_PARAMS_TYPE_ENUM.TRIGGER) {
        value.value = false
      }
    })
  }


  abstract run(): void

  abstract init(): void
}


