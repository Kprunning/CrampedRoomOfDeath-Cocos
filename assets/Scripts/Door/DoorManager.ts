import {_decorator} from 'cc'
import EntityManager from '../../Base/EntityManager'
import DoorStateMachine from './DoorStateMachine'
import {IEntity} from '../../Levels'
import EventManager from '../../Runtime/EventManager'
import {AUDIO_NAME_ENUM, ENTITY_STATE_ENUM, EVENT_ENUM} from '../../Enums'
import DataManager from '../../Runtime/DataManager'

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
    if (this.state !== ENTITY_STATE_ENUM.DEATH && DataManager.Instance.enemies.every(enemy => enemy.state === ENTITY_STATE_ENUM.DEATH)) {
      this.state = ENTITY_STATE_ENUM.DEATH
      EventManager.Instance.emit(EVENT_ENUM.PLAY_AUDIO, AUDIO_NAME_ENUM.DOOR_OPEN)
    }
  }
}


