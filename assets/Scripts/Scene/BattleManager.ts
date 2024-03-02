import {_decorator, Component, Node} from 'cc'
import {TileMapManager} from '../Tile/TileMapManager'
import {createUINode} from '../../Utils'
import levels, {ILevel} from '../../Levels'
import {TILE_HEIGHT, TILE_WIDTH} from '../Tile/TileManager'
import DataManager from '../../Runtime/DataManager'

const {ccclass, property} = _decorator

@ccclass('BattleManager')
export class BattleManager extends Component {
  private stage: Node
  private level: ILevel


  start() {
    this.generateStage()
    this.initLevel()
  }


  private generateStage() {
    // 生成舞台
    this.stage = createUINode()
    this.stage.setParent(this.node)
  }

  private initLevel() {
    this.level = levels[`level${1}`]
    if (this.level) {
      const {mapInfo} = this.level
      DataManager.Instance.mapInfo = mapInfo
      DataManager.Instance.mapRowCount = mapInfo.length || 0
      DataManager.Instance.mapColumnCount = mapInfo[0].length || 0
      this.generateTileMap()
    }
  }

  private generateTileMap() {
    // 生成地图
    const tileMap = createUINode()
    tileMap.setParent(this.stage)
    const tileMapManager = tileMap.addComponent(TileMapManager)
    tileMapManager.init().then(() => {
      this.adaptMapPosition()
    })
  }

  // 调整地图位置,使地图居中
  private adaptMapPosition() {
    const posX = DataManager.Instance.mapRowCount * TILE_WIDTH / 2
    const posY = DataManager.Instance.mapColumnCount * TILE_HEIGHT / 2 + 80
    this.stage.setPosition(-posX, posY)
  }
}


