import {_decorator, Component, Event} from 'cc'
import EventManager from '../../Runtime/EventManager'
import {CTRL_DIRECTION_ENUM, EVENT_ENUM} from '../../Enums'

const {ccclass, property} = _decorator

@ccclass('MenuManager')
export class MenuManager extends Component {
  handleUndo() {
    EventManager.Instance.emit(EVENT_ENUM.REVOKE_STEP)
  }

  handleRestart() {
    EventManager.Instance.emit(EVENT_ENUM.RESTART_LEVEL)
  }

  handleOut() {
    EventManager.Instance.emit(EVENT_ENUM.OUT_BATTLE)
  }
}


