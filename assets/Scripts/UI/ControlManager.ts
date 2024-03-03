import {_decorator, Component, Event} from 'cc'
import EventManager from '../../Runtime/EventManager'
import {CTRL_DIRECTION_ENUM, EVENT_ENUM} from '../../Enums'

const {ccclass, property} = _decorator

@ccclass('ControlManager')
export class ControlManager extends Component {
  handleCtrl(event: Event, ctrlDirection: string) {
    EventManager.Instance.emit(EVENT_ENUM.CTRL_DIRECTION, ctrlDirection as CTRL_DIRECTION_ENUM)
  }
}


