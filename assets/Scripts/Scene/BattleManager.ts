import {_decorator, Component, Node} from 'cc'
import {TileMapManager} from '../Tile/TileMapManager'
import {createUINode} from '../../Utils'
import levels, {ILevel} from '../../Levels'
import {TILE_HEIGHT, TILE_WIDTH} from '../Tile/TileManager'
import DataManager from '../../Runtime/DataManager'
import EventManager from '../../Runtime/EventManager'
import {EVENT_ENUM} from '../../Enums'
import {PlayerManager} from '../Player/PlayerManager'
import WoodenSkeletonManager from '../WoodenSkeleton/WoodenSkeletonManager'

const {ccclass, property} = _decorator

@ccclass('BattleManager')
export class BattleManager extends Component {
  private stage: Node
  private level: ILevel

  onLoad() {
    EventManager.Instance.on(EVENT_ENUM.NEXT_LEVEL, this.nextLevel, this)
  }

  onDestroy() {
    EventManager.Instance.off(EVENT_ENUM.NEXT_LEVEL, this.nextLevel)
  }


  start() {
    this.generateStage()
    this.initLevel()
    this.generatePlayer()
    this.generateEnemies()
  }

  // 生成舞台
  private generateStage() {
    this.stage = createUINode()
    this.stage.setParent(this.node)
  }

  // 生成玩家
  private generatePlayer() {
    const player = createUINode()
    player.setParent(this.stage)
    const playerManager = player.addComponent(PlayerManager)
    playerManager.init()
  }

  // 生成敌人
  private generateEnemies() {
    const enemy = createUINode()
    enemy.setParent(this.stage)
    const woodenSkeletonManager = enemy.addComponent(WoodenSkeletonManager)
    woodenSkeletonManager.init()
  }

  private initLevel() {
    const level = levels[`level${DataManager.Instance.levelIndex}`]
    if (level) {
      this.clearLevel()
      this.level = level
      const {mapInfo} = level
      DataManager.Instance.mapInfo = mapInfo
      DataManager.Instance.mapRowCount = mapInfo.length || 0
      DataManager.Instance.mapColumnCount = mapInfo[0].length || 0
      this.generateTileMap()
    }
  }

  nextLevel() {
    DataManager.Instance.levelIndex++
    this.initLevel()
  }

  clearLevel() {
    // 切换关卡时,清空旧数据
    this.stage.destroyAllChildren()
    // 重置数据中心
    DataManager.Instance.reset()
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


