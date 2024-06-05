import {DIRECTION_ENUM, SHAKE_TYPE_ENUM} from '../../Enums'
import State, {ANIMATION_SPEED} from '../../Base/State'
import DirectionSubStateMachine from '../../Base/DirectionSubStateMachine'
import StateMachine from '../../Base/StateMachine'
import {AnimationClip} from 'cc'


const BASE_URL = '/texture/player/attack'

export default class AttackSubStateMachine extends DirectionSubStateMachine {
  constructor(public fsm: StateMachine) {
    super(fsm)
    this.stateMachines.set(DIRECTION_ENUM.TOP, new State(fsm, `${BASE_URL}/top`, AnimationClip.WrapMode.Normal, ANIMATION_SPEED, [{
      // 第4帧结束,第五帧开始触发时间
      frame: ANIMATION_SPEED * 4,
      // 事件触发时调用的函数名称
      func: 'onAttackShake',
      // 向 `func` 传递的参数
      params: [SHAKE_TYPE_ENUM.TOP]
    }]))
    this.stateMachines.set(DIRECTION_ENUM.BOTTOM, new State(fsm, `${BASE_URL}/bottom`, AnimationClip.WrapMode.Normal, ANIMATION_SPEED, [{
      frame: ANIMATION_SPEED * 4,
      func: 'onAttackShake',
      params: [SHAKE_TYPE_ENUM.BOTTOM]
    }]))
    this.stateMachines.set(DIRECTION_ENUM.LEFT, new State(fsm, `${BASE_URL}/left`, AnimationClip.WrapMode.Normal, ANIMATION_SPEED, [{
      frame: ANIMATION_SPEED * 4,
      func: 'onAttackShake',
      params: [SHAKE_TYPE_ENUM.LEFT]
    }]))
    this.stateMachines.set(DIRECTION_ENUM.RIGHT, new State(fsm, `${BASE_URL}/right`, AnimationClip.WrapMode.Normal, ANIMATION_SPEED, [{
      frame: ANIMATION_SPEED * 4,
      func: 'onAttackShake',
      params: [SHAKE_TYPE_ENUM.RIGHT]
    }]))
  }
}
