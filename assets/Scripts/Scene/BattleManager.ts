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
import SpikesManager from '../Spikes/SpikesManager'
import SmokeManager from '../Smoke/SmokeManager'

const {ccclass, property} = _decorator

@ccclass('BattleManager')
export class BattleManager extends Component {
  private stage: Node
  private level: ILevel
  private smokeLayer: Node

  onLoad() {
    EventManager.Instance.on(EVENT_ENUM.NEXT_LEVEL, this.nextLevel, this)
    EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.checkArrived, this)
    EventManager.Instance.on(EVENT_ENUM.SHOW_SMOKE, this.generateSmoke, this)
  }

  onDestroy() {
    EventManager.Instance.off(EVENT_ENUM.NEXT_LEVEL, this.nextLevel)
    EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.checkArrived)
    EventManager.Instance.off(EVENT_ENUM.SHOW_SMOKE, this.generateSmoke)
  }


  async start() {
    this.generateStage()
    await this.initLevel()
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
    await playerManager.init(this.level.player)
    DataManager.Instance.player = playerManager
    EventManager.Instance.emit(EVENT_ENUM.PLAYER_BORN, true)
  }

  // 生成敌人
  private async generateEnemies() {
    const enemies = this.level.enemies
    for (let i = 0; i < enemies.length; i++) {
      const enemy = createUINode()
      enemy.setParent(this.stage)
      const Manager = enemies[i].type === ENTITY_TYPE_ENUM.SKELETON_WOODEN ? WoodenSkeletonManager : IronSkeletonManager
      const skeletonManager = enemy.addComponent(Manager)
      await skeletonManager.init(enemies[i])
      DataManager.Instance.enemies.push(skeletonManager)
    }
  }

  // 生成门
  private async generateDoor() {
    const door = createUINode()
    door.setParent(this.stage)
    const doorManager = door.addComponent(DoorManager)
    await doorManager.init(this.level.door)
    DataManager.Instance.door = doorManager
  }

  // 生成地裂
  private async generateBurst() {
    const bursts = this.level.bursts
    for (let i = 0; i < bursts.length; i++) {
      const burst = createUINode()
      burst.setParent(this.stage)
      const burstManager = burst.addComponent(BurstManager)
      await burstManager.init(bursts[i])
      DataManager.Instance.busts.push(burstManager)
    }
  }


  // 生成地刺
  private async generateSpikes() {
    const spikes = this.level.spikes
    for (let i = 0; i < spikes.length; i++) {
      const spike = createUINode()
      spike.setParent(this.stage)
      const spikesManager = spike.addComponent(SpikesManager)
      await spikesManager.init(spikes[i])
      DataManager.Instance.spikes.push(spikesManager)
    }
  }

  // 生成烟雾图层,保证玩家显示优先
  private async generateSmokeLayer() {
    this.smokeLayer = createUINode()
    this.smokeLayer.setParent(this.stage)
  }

  // 玩家移动时,生成烟雾效果
  private async generateSmoke(x: number, y: number, direction: DIRECTION_ENUM) {
    const smoke = createUINode()
    smoke.setParent(this.smokeLayer)
    const smokeManager = smoke.addComponent(SmokeManager)
    await smokeManager.init({
      x,
      y,
      state: ENTITY_STATE_ENUM.IDLE,
      type: ENTITY_TYPE_ENUM.SMOKE,
      direction
    })
    DataManager.Instance.smokes.push(smokeManager)
  }

  private async initLevel() {
    const level = levels[`level${DataManager.Instance.levelIndex}`]
    if (level) {
      this.clearLevel()
      this.level = level
      const {mapInfo} = level
      DataManager.Instance.mapInfo = mapInfo
      DataManager.Instance.mapRowCount = mapInfo.length || 0
      DataManager.Instance.mapColumnCount = mapInfo[0]?.length || 0
      await Promise.all([
        this.generateTileMap(),
        this.generateDoor(),
        this.generateBurst(),
        this.generateSpikes(),
        this.generateEnemies(),
        this.generateSmokeLayer()
      ])
      await this.generatePlayer()
    }
  }

  async nextLevel() {
    DataManager.Instance.levelIndex++
    await this.initLevel()
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

  // 人物到达门后,进入下一关
  private checkArrived() {
    if (!DataManager.Instance.door || !DataManager.Instance.player) {
      return
    }
    const {x: playerX, y: playerY} = DataManager.Instance.player
    const {x: doorX, y: doorY, state: doorState} = DataManager.Instance.door
    if (playerX === doorX && playerY === doorY && doorState === ENTITY_STATE_ENUM.DEATH) {
      EventManager.Instance.emit(EVENT_ENUM.NEXT_LEVEL)
    }
  }

}


