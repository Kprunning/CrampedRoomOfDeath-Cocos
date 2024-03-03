import {_decorator, Component} from 'cc'
import EventManager from '../../Runtime/EventManager'
import {EventEnum} from '../../Enums'

const {ccclass, property} = _decorator

@ccclass('ControlManager')
export class ControlManager extends Component {
  handleCtrl() {
    EventManager.Instance.emit(EventEnum.NEXT_LEVEL)
  }
}


