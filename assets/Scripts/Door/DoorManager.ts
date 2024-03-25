import {_decorator} from 'cc'
import EntityManager from '../../Base/EntityManager'
import DoorStateMachine from './DoorStateMachine'
import {IEntity} from '../../Levels'
import EventManager from '../../Runtime/EventManager'
import {ENTITY_STATE_ENUM, EVENT_ENUM} from '../../Enums'

const {ccclass, property} = _decorator


@ccclass('DoorManager')
export class DoorManager extends EntityManager {

  async init(params: IEntity) {
    this.fsm = this.addComponent(DoorStateMachine)
    await this.fsm.init()
    super.init(params)
    EventManager.Instance.on(EVENT_ENUM.DOOR_OPEN, this.onDoorOpen, this)
  }

  protected onDestroy() {
    super.onDestroy()
    EventManager.Instance.off(EVENT_ENUM.DOOR_OPEN, this.onDoorOpen)
  }

  private onDoorOpen() {
    if (this.state === ENTITY_STATE_ENUM.DEATH) {
      return
    } else {
      this.state = ENTITY_STATE_ENUM.DEATH
    }
  }
}


