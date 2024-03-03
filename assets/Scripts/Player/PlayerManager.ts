import {_decorator, Animation, animation, AnimationClip, Component, Sprite, SpriteFrame, UITransform} from 'cc'
import {TILE_HEIGHT, TILE_WIDTH} from '../Tile/TileManager'
import ResourceManager from '../../Runtime/ResourceManager'
import {CTRL_DIRECTION_ENUM, EVENT_ENUM} from '../../Enums'
import EventManager from '../../Runtime/EventManager'

const {ccclass, property} = _decorator

const ANIMATION_SPEED = 1 / 8

@ccclass('PlayerManager')
export class PlayerManager extends Component {
  x = 0
  y = 0
  targetX = 0
  targetY = 0
  private readonly speed = 1 / 10

  async init() {
    await this.render()
    EventManager.Instance.on(EVENT_ENUM.CTRL_DIRECTION, this.move, this)
  }

  protected onDestroy() {
    EventManager.Instance.off(EVENT_ENUM.CTRL_DIRECTION, this.move)
  }

  protected update(dt: number) {
    this.updateXY()
    this.node.setPosition(TILE_WIDTH * this.x + 1.5 * TILE_WIDTH, TILE_HEIGHT * this.y - 1.5 * TILE_HEIGHT)
  }

  move(ctrlDirection: CTRL_DIRECTION_ENUM) {
    switch (ctrlDirection) {
      case CTRL_DIRECTION_ENUM.BOTTOM:
        this.targetY--
        break
      case CTRL_DIRECTION_ENUM.TOP:
        this.targetY++
        break
      case CTRL_DIRECTION_ENUM.LEFT:
        this.targetX--
        break
      case CTRL_DIRECTION_ENUM.RIGHT:
        this.targetX++
    }
  }

  updateXY() {
    if (this.x < this.targetX) {
      this.x += this.speed
    } else if (this.x > this.targetX) {
      this.x -= this.speed
    } else if (this.y < this.targetY) {
      this.y += this.speed
    } else if (this.y > this.targetY) {
      this.y -= this.speed
    }
    // 防止鬼畜乱动
    if (Math.abs(this.x - this.targetX) <= 0.1) {
      this.x = this.targetX
    }
    if (Math.abs(this.y - this.targetY) <= 0.1) {
      this.y = this.targetY
    }
  }

  async render() {
    const sprite = this.addComponent(Sprite)
    // 自定义大小
    sprite.sizeMode = Sprite.SizeMode.CUSTOM
    const uiTransform = this.addComponent(UITransform)
    uiTransform.setContentSize(TILE_WIDTH * 4, TILE_HEIGHT * 4)

    const animationClip = new AnimationClip()
    animationClip.duration = 1.0 // 整个动画剪辑的周期

    const track = new animation.ObjectTrack()
    track.path = new animation.TrackPath().toComponent(Sprite).toProperty('spriteFrame') // 指定轨道路径，即指定目标对象为 "Foo" 子节点的 "position" 属性
    // 加载玩家动画资源
    const spriteFrames = await ResourceManager.Instance.loadDir('/texture/player/idle/top')
    const frames: Array<[number, SpriteFrame]> = spriteFrames.map((spriteFrame, index) => [index * ANIMATION_SPEED, spriteFrame])
    track.channel.curve.assignSorted(frames)

    animationClip.addTrack(track)
    animationClip.duration = spriteFrames.length * ANIMATION_SPEED
    animationClip.wrapMode = AnimationClip.WrapMode.Loop

    const animationComponent = this.addComponent(Animation)
    animationComponent.defaultClip = animationClip
    animationComponent.play()
  }
}


