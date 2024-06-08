import {_decorator, Component, director, Node} from 'cc'
import FaderManager from 'db://assets/Runtime/FaderManager'
import {SCENE_ENUM} from 'db://assets/Enums'

const {ccclass, property} = _decorator

@ccclass('StartManager')
export class StartManager extends Component {

  protected onLoad() {
    FaderManager.Instance.fadeOut(1000)
    this.node.once(Node.EventType.TOUCH_END, this.handleStart, this)
  }

  private async handleStart() {
    await FaderManager.Instance.fadeIn(300)
    director.loadScene(SCENE_ENUM.BATTLE)
  }
}


