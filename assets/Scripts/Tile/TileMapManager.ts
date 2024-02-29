import {_decorator, Component, Layers, Node, resources, Sprite, SpriteFrame, UITransform} from 'cc'
import levels from '../../Levels'

const {ccclass, property} = _decorator

const TILE_WIDTH = 55
const TILE_HEIGHT = 55


@ccclass('TileMapManager')
export class TileMapManager extends Component {
  async init() {
    // 获取第一关
    const {mapInfo} = levels[`level${1}`]
    const spriteFrames = await this.loadRes()
    for (let i = 0; i < mapInfo.length; i++) {
      const column = mapInfo[i]
      for (let j = 0; j < column.length; j++) {
        const item = column[j]
        // 跳过空内容
        if (item.src == null || item.type == null) {
          continue
        }

        // 文件名称
        const name = `tile (${item.src})`
        const spriteFrame = spriteFrames.find(item => item.name === name) || spriteFrames[0]
        const node = new Node()
        const spriteComponent = node.addComponent(Sprite)
        spriteComponent.spriteFrame = spriteFrame

        // 设置瓦片大小
        const uiCom = node.addComponent(UITransform)
        uiCom.setContentSize(TILE_WIDTH, TILE_HEIGHT)

        // 设置图层
        node.layer = 1 << Layers.nameToLayer('UI_2D')
        // 设置位置
        node.setPosition(i * TILE_WIDTH, -j * TILE_HEIGHT)

        node.setParent(this.node)
      }
    }
  }

  loadRes() {
    return new Promise<SpriteFrame[]>((resolve, reject) => {
      resources.loadDir('/texture/tile/tile', SpriteFrame, function (err, assets) {
        if (err) {
          reject(err)
        } else {
          resolve(assets)
        }
      })
    })
  }
}


