import {_decorator, Component, game} from 'cc'
import EventManager from 'db://assets/Runtime/EventManager'
import {EVENT_ENUM, SHAKE_TYPE_ENUM} from 'db://assets/Enums'

const {ccclass, property} = _decorator


@ccclass('ShakeManager')
export class ShakeManager extends Component {
  private isShaking: boolean = false
  private oldTime: number = 0
  private oldPosition: { x: number, y: number } = {x: 0, y: 0}
  private type: SHAKE_TYPE_ENUM

  protected onLoad() {
    EventManager.Instance.on(EVENT_ENUM.SCREEN_SHAKE, this.onShake, this)
  }

  protected onDestroy() {
    EventManager.Instance.off(EVENT_ENUM.SCREEN_SHAKE, this.onShake)
  }

  private onShake(type: SHAKE_TYPE_ENUM) {
    if (this.isShaking) {
      return
    }
    this.type = type
    this.oldTime = game.totalTime
    this.oldPosition.x = this.node.position.x
    this.oldPosition.y = this.node.position.y
    this.isShaking = true
  }

  protected update(dt: number) {
    if (this.isShaking) {
      const duration = 200
      const amount = 16
      const frequency = 12
      const curSecond = (game.totalTime - this.oldTime) / 1000
      const totalSecond = duration / 1000
      const offset = Math.sin(curSecond * frequency * Math.PI) * amount

      switch (this.type) {
        case SHAKE_TYPE_ENUM.TOP:
          this.node.setPosition(this.oldPosition.x, this.oldPosition.y - offset)
          break
        case SHAKE_TYPE_ENUM.BOTTOM:
          this.node.setPosition(this.oldPosition.x, this.oldPosition.y + offset)
          break
        case SHAKE_TYPE_ENUM.LEFT:
          this.node.setPosition(this.oldPosition.x - offset, this.oldPosition.y)
          break
        case SHAKE_TYPE_ENUM.RIGHT:
          this.node.setPosition(this.oldPosition.x + offset, this.oldPosition.y)
          break
      }
      if (curSecond > totalSecond) {
        this.isShaking = false
        this.node.setPosition(this.oldPosition.x, this.oldPosition.y)
      }
    }
  }

  stop() {
    this.isShaking = false
  }
}


