import {_decorator, Component, Node} from 'cc'
import {TileMapManager} from '../Tile/TileMapManager'
import {createUINode} from '../../Utils'
import levels, {ILevel} from '../../Levels'
import {TILE_HEIGHT, TILE_WIDTH} from '../Tile/TileManager'
import DataManager from '../../Runtime/DataManager'
import EventManager from '../../Runtime/EventManager'
import {DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM} from '../../Enums'
import {PlayerManager} from '../Player/PlayerManager'
import WoodenSkeletonManager from '../WoodenSkeleton/WoodenSkeletonManager'
import IronSkeletonManager from '../IronSkeleton/IronSkeletonManager'
import {DoorManager} from '../Door/DoorManager'
import BurstManager from '../Burst/BurstManager'

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
    this.generateEnemies()
    this.generateDoor()
    this.generateBurst()
    this.generatePlayer()
  }

  // 生成舞台
  private generateStage() {
    this.stage = createUINode()
    this.stage.setParent(this.node)
  }

  // 生成玩家
  private async generatePlayer() {
    const player = createUINode()
    player.setParent(this.stage)
    const playerManager = player.addComponent(PlayerManager)
    await playerManager.init({
      x: 2,
      y: 8,
      type: ENTITY_TYPE_ENUM.PLAYER,
      direction: DIRECTION_ENUM.TOP,
      state: ENTITY_STATE_ENUM.IDLE
    })
    DataManager.Instance.player = playerManager
    EventManager.Instance.emit(EVENT_ENUM.PLAYER_BORN, true)
  }

  // 生成敌人
  private async generateEnemies() {
    const enemy1 = createUINode()
    enemy1.setParent(this.stage)
    const woodenSkeletonManager = enemy1.addComponent(WoodenSkeletonManager)
    await woodenSkeletonManager.init({
      x: 2,
      y: 4,
      type: ENTITY_TYPE_ENUM.SKELETON_WOODEN,
      direction: DIRECTION_ENUM.TOP,
      state: ENTITY_STATE_ENUM.IDLE
    })
    DataManager.Instance.enemies.push(woodenSkeletonManager)

    const enemy2 = createUINode()
    enemy2.setParent(this.stage)
    const ironSkeletonManager = enemy2.addComponent(IronSkeletonManager)
    await ironSkeletonManager.init({
      x: 2,
      y: 5,
      type: ENTITY_TYPE_ENUM.SKELETON_IRON,
      direction: DIRECTION_ENUM.TOP,
      state: ENTITY_STATE_ENUM.IDLE
    })
    DataManager.Instance.enemies.push(ironSkeletonManager)
  }

  // 生成门
  private async generateDoor() {
    const door = createUINode()
    door.setParent(this.stage)
    const doorManager = door.addComponent(DoorManager)
    await doorManager.init({
      x: 7,
      y: 8,
      type: ENTITY_TYPE_ENUM.DOOR,
      direction: DIRECTION_ENUM.TOP,
      state: ENTITY_STATE_ENUM.IDLE
    })
    DataManager.Instance.door = doorManager
  }

  // 生成地裂
  private async generateBurst() {
    const burst = createUINode()
    burst.setParent(this.stage)
    const burstManager = burst.addComponent(BurstManager)
    await burstManager.init({
      x: 2,
      y: 6,
      type: ENTITY_TYPE_ENUM.BURST,
      direction: DIRECTION_ENUM.TOP,
      state: ENTITY_STATE_ENUM.IDLE
    })
    DataManager.Instance.busts.push(burstManager)
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

  private async generateTileMap() {
    // 生成地图
    const tileMap = createUINode()
    tileMap.setParent(this.stage)
    const tileMapManager = tileMap.addComponent(TileMapManager)
    await tileMapManager.init()
    this.adaptMapPosition()
  }

  // 调整地图位置,使地图居中
  private adaptMapPosition() {
    const posX = DataManager.Instance.mapRowCount * TILE_WIDTH / 2
    const posY = DataManager.Instance.mapColumnCount * TILE_HEIGHT / 2 + 80
    this.stage.setPosition(-posX, posY)
  }


}


