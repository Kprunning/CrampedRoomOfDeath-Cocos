import {ENTITY_TYPE_ENUM, PARAMS_NAME_ENUM, SPIKE_COUNT_ENUM, SPIKE_COUNT_MAP_NUM_ENUM, SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM} from '../../Enums'
import State from '../../Base/State'
import StateMachine from '../../Base/StateMachine'
import SubStateMachine from '../../Base/SubStateMachine'


const BASE_URL = '/texture/spikes/spikes'

export default class SpikesSubStateMachine extends SubStateMachine {

  constructor(public fsm: StateMachine, spikesType: ENTITY_TYPE_ENUM) {
    super(fsm)
    const totalStr = spikesType.substring(spikesType.indexOf('_') + 1, spikesType.length).toLowerCase()
    const totalNum = SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM[spikesType] + 1
    for (let i = 0; i < totalNum; i++) {
      this.stateMachines.set(SPIKE_COUNT_ENUM[SPIKE_COUNT_MAP_NUM_ENUM[i]], new State(fsm, `${BASE_URL}${totalStr}/${SPIKE_COUNT_MAP_NUM_ENUM[i].toLowerCase()}`))
    }
  }

  run(): void {
    const value = this.fsm.getParams(PARAMS_NAME_ENUM.SPIKES_CUR_COUNT)
    this.currentState = this.stateMachines.get(SPIKE_COUNT_MAP_NUM_ENUM[value as number])
  }
}
