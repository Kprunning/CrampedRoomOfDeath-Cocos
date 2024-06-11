import {_decorator, Component, director, Node} from 'cc'
import FaderManager from 'db://assets/Runtime/FaderManager'
import {SCENE_ENUM} from 'db://assets/Enums'

const {ccclass, property} = _decorator

@ccclass('StartManager')
export class StartManager extends Component {
  private tips: Node
  private flashInterval = 0.5
  private currentTime = 0

  protected onLoad() {
    FaderManager.Instance.fadeOut(1000)
    this.node.once(Node.EventType.TOUCH_END, this.handleStart, this)
    this.tips = this.node.getChildByName('Tips')
    console.log(this.tips)
  }

  private async handleStart() {
    await FaderManager.Instance.fadeIn(300)
    director.loadScene(SCENE_ENUM.Battle)
  }

  protected update(dt: number) {
    if (this.currentTime <= this.flashInterval) {
      this.currentTime += dt
    } else {
      this.currentTime = 0
      this.tips.active = !this.tips.active
    }
  }
}


