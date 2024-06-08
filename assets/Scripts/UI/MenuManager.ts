import {_decorator, Component, Event} from 'cc'
import EventManager from '../../Runtime/EventManager'
import {CTRL_DIRECTION_ENUM, EVENT_ENUM} from '../../Enums'

const {ccclass, property} = _decorator

@ccclass('MenuManager')
export class MenuManager extends Component {
  handleUndo() {
    console.log('handleUndo')
    EventManager.Instance.emit(EVENT_ENUM.REVOKE_STEP)
  }
}


