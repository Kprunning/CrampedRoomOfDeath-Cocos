import {animation, AnimationClip, Sprite, SpriteFrame} from 'cc'
import ResourceManager from '../Runtime/ResourceManager'
import StateMachine from './StateMachine'
import {sortSpriteFrames} from '../Utils'

export const ANIMATION_SPEED = 1 / 8

export default class State {
  private animationClip: AnimationClip

  constructor(
    private fsm: StateMachine,
    private path: string,
    private wrapMode: AnimationClip.WrapMode = AnimationClip.WrapMode.Normal,
    private speed: number = ANIMATION_SPEED,
    private events: any[] = []
  ) {
    this.init()
  }

  async init() {
    const promise = ResourceManager.Instance.loadDir(this.path)
    this.fsm.waitingList.push(promise)
    const spriteFrames = await promise
    this.animationClip = new AnimationClip()
    this.animationClip.duration = 1.0 // 整个动画剪辑的周期

    const track = new animation.ObjectTrack()
    track.path = new animation.TrackPath().toComponent(Sprite).toProperty('spriteFrame') // 指定轨道路径，即指定目标对象为 "Foo" 子节点的 "position" 属性
    // 加载玩家动画资源
    const frames: Array<[number, SpriteFrame]> = sortSpriteFrames(spriteFrames).map((spriteFrame, index) => [index * ANIMATION_SPEED, spriteFrame])
    track.channel.curve.assignSorted(frames)

    this.animationClip.addTrack(track)
    this.animationClip.duration = spriteFrames.length * this.speed
    this.animationClip.wrapMode = this.wrapMode
    this.animationClip.name = this.path
    this.events.forEach(event => {
      this.animationClip.events.push(event)
    })
    // 提交事件数据的修改
    this.animationClip.events = this.animationClip.events
  }

  async run() {
    // 如果动画没有变化,直接返回,避免动画抖动的现象
    if (this.fsm.animationComponent?.defaultClip?.name === this.animationClip.name) {
      return
    }
    this.fsm.animationComponent.defaultClip = this.animationClip
    this.fsm.animationComponent.play()
  }
}
