import {_decorator, Component, Sprite, SpriteFrame, UITransform} from 'cc'

const {ccclass, property} = _decorator


export const TILE_WIDTH = 55
export const TILE_HEIGHT = 55

@ccclass('TileManager')
export class TileManager extends Component {
  init(spriteFrame: SpriteFrame, i: number, j: number) {
    const spriteComponent = this.addComponent(Sprite)
    spriteComponent.spriteFrame = spriteFrame

    // 设置瓦片大小
    const transform = this.getComponent(UITransform)
    transform.setContentSize(TILE_WIDTH, TILE_HEIGHT)

    // 设置位置
    this.node.setPosition(i * TILE_WIDTH, -j * TILE_HEIGHT)
  }
}


