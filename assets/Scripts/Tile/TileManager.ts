import {_decorator, Component, Sprite, SpriteFrame, UITransform} from 'cc'
import {TILE_TYPE_ENUM} from '../../Enums'

const {ccclass, property} = _decorator


export const TILE_WIDTH = 55
export const TILE_HEIGHT = 55

@ccclass('TileManager')
export default class TileManager extends Component {
  moveable: boolean
  turnable: boolean

  init(type: TILE_TYPE_ENUM, spriteFrame: SpriteFrame, i: number, j: number) {
    const spriteComponent = this.addComponent(Sprite)
    spriteComponent.spriteFrame = spriteFrame

    // 设置瓦片大小
    const transform = this.getComponent(UITransform)
    transform.setContentSize(TILE_WIDTH, TILE_HEIGHT)

    // 设置位置
    this.node.setPosition(i * TILE_WIDTH, -j * TILE_HEIGHT)

    // 判断是否可以移动和转向
    const wallList = ['WALL_LEFT_TOP', 'WALL_LEFT_BOTTOM', 'WALL_COLUMN', 'WALL_ROW', 'WALL_RIGHT_BOTTOM', 'WALL_RIGHT_TOP']
    const cliffList = ['CLIFF_LEFT', 'CLIFF_CENTER', 'CLIFF_RIGHT']
    if (wallList.some(item => item === type)) {
      this.moveable = false
      this.turnable = false
    } else {
      if (cliffList.some(item => item === type)) {
        this.moveable = false
        this.turnable = true
      } else if (type === 'CLIFF_RIGHT') {
        this.moveable = true
        this.turnable = true
      }
    }
  }
}


