import {_decorator, BlockInputEvents, Color, Component, game, Graphics, UITransform, view} from 'cc'

const {ccclass, property} = _decorator

const SCREEN_WIDTH = view.getVisibleSize().width
const SCREEN_HEIGHT = view.getVisibleSize().height
export const DEFAULT_DURATION = 2000

enum FADE_STATE_ENUM {
  IDLE = 'IDLE',
  FADE_IN = 'FADE_IN',
  FADE_OUT = 'FADE_OUT',
}

@ccclass('DrawManager')
export class DrawManager extends Component {
  private ctx: Graphics
  private state: FADE_STATE_ENUM = FADE_STATE_ENUM.IDLE
  private oldTime: number = 0
  private duration: number
  private fadeResolve: (value: (PromiseLike<unknown> | unknown)) => void
  private block: BlockInputEvents

  init() {
    this.block = this.addComponent(BlockInputEvents)
    this.ctx = this.addComponent(Graphics)
    const transform = this.getComponent(UITransform)
    transform.setAnchorPoint(0.5, 0.5)
    transform.setContentSize(SCREEN_WIDTH, SCREEN_HEIGHT)
    this.setAlpha(1)
  }

  private setAlpha(percent: number) {
    this.ctx.clear()
    this.ctx.rect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)
    this.ctx.fillColor = new Color(0, 0, 0, 255 * percent)
    this.ctx.fill()
    // 屏幕全黑的时候,阻止用户输入
    this.block.enabled = percent === 1
  }

  fadeIn(duration: number = DEFAULT_DURATION) {
    this.setAlpha(0)
    this.duration = duration
    this.oldTime = game.totalTime
    this.state = FADE_STATE_ENUM.FADE_IN
    return new Promise((resolve) => {
      this.fadeResolve = resolve
    })
  }

  fadeOut(duration: number = DEFAULT_DURATION) {
    this.setAlpha(1)
    this.duration = duration
    this.oldTime = game.totalTime
    this.state = FADE_STATE_ENUM.FADE_OUT
    return new Promise((resolve) => {
      this.fadeResolve = resolve
    })
  }

  protected update() {
    const percent = (game.totalTime - this.oldTime) / this.duration
    switch (this.state) {
      case FADE_STATE_ENUM.FADE_IN:
        if (percent < 1) {
          this.setAlpha(percent)
        } else {
          this.setAlpha(1)
          this.state = FADE_STATE_ENUM.IDLE
          this.fadeResolve(null)
        }
        break
      case FADE_STATE_ENUM.FADE_OUT:
        if (percent < 1) {
          this.setAlpha(1 - percent)
        } else {
          this.setAlpha(0)
          this.state = FADE_STATE_ENUM.IDLE
          this.fadeResolve(null)
        }
        break
    }
  }



}


