import {_decorator, Component} from 'cc'
import {createUINode, randomByRange} from '../../Utils'
import {TileManager} from './TileManager'
import DataManager from '../../Runtime/DataManager'
import ResourceManager from '../../Runtime/ResourceManager'

const {ccclass, property} = _decorator


@ccclass('TileMapManager')
export class TileMapManager extends Component {
  async init() {
    // 获取第一关
    const {mapInfo} = DataManager.Instance
    const spriteFrames = await ResourceManager.Instance.loadDir('/texture/tile/tile')
    for (let i = 0; i < mapInfo.length; i++) {
      const column = mapInfo[i]
      for (let j = 0; j < column.length; j++) {
        const item = column[j]
        // 跳过空内容
        if (item.src == null || item.type == null) {
          continue
        }

        // 图片(1-4,5-8,9-12为3组同类图片,进行随机变化. 避免太过于随机, 只在偶数行列进行)
        let number = item.src
        if ((number === 1 || number === 5 || number === 9) && i % 2 === 0 && j % 2 === 0) {
          number += randomByRange(0, 4)
        }
        const name = `tile (${number})`
        const spriteFrame = spriteFrames.find(item => item.name === name) || spriteFrames[0]

        const node = createUINode()
        const tileManager = node.addComponent(TileManager)
        tileManager.init(spriteFrame, i, j)
        node.setParent(this.node)
      }
    }
  }
}


