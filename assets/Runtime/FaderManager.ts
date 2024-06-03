import {director, RenderRoot2D} from 'cc'
import Singleton from '../Base/Singleton'
import {DEFAULT_DURATION, DrawManager} from 'db://assets/Scripts/UI/DrawManager'
import {createUINode} from 'db://assets/Utils'

export default class FaderManager extends Singleton {

  static get Instance(): FaderManager {
    return super.GetInstance<FaderManager>()
  }

  private _fader: DrawManager = null

  get fader() {
    if (this._fader !== null) {
      return this._fader
    }

    const root = createUINode()
    root.addComponent(RenderRoot2D)

    const fadeNode = createUINode()
    fadeNode.setParent(root)
    this._fader = fadeNode.addComponent(DrawManager)
    this._fader.init()

    director.addPersistRootNode(root)
    return this._fader
  }

  fadeIn(duration: number = DEFAULT_DURATION) {
    return this.fader.fadeIn(duration)
  }

  fadeOut(duration: number = DEFAULT_DURATION) {
    return this.fader.fadeOut(duration)
  }
}
