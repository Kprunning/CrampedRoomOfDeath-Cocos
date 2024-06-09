import {_decorator, Component, director, ProgressBar, resources} from 'cc'
import {SCENE_ENUM} from 'db://assets/Enums'

const {ccclass, property} = _decorator

@ccclass('LoadingManager')
export class LoadingManager extends Component {
  @property(ProgressBar)
  bar: ProgressBar = null

  protected onLoad() {
    resources.preloadDir('texture', (cur, total) => {
      this.bar.progress = cur / total
    }, () => {
      director.loadScene(SCENE_ENUM.Start)
    })
  }

}


