import {_decorator, Component, director, Node} from 'cc'
import {TileMapManager} from '../Tile/TileMapManager'
import {createUINode} from '../../Utils'
import levels, {ILevel} from '../../Levels'
import {TILE_HEIGHT, TILE_WIDTH} from '../Tile/TileManager'
import DataManager, {IRecord} from '../../Runtime/DataManager'
import EventManager from '../../Runtime/EventManager'
import {DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM, SCENE_ENUM} from '../../Enums'
import {PlayerManager} from '../Player/PlayerManager'
import WoodenSkeletonManager from '../WoodenSkeleton/WoodenSkeletonManager'
import IronSkeletonManager from '../IronSkeleton/IronSkeletonManager'
import {DoorManager} from '../Door/DoorManager'
import BurstManager from '../Burst/BurstManager'
import SpikesManager from '../Spikes/SpikesManager'
import SmokeManager from '../Smoke/SmokeManager'
import FaderManager from 'db://assets/Runtime/FaderManager'
import {ShakeManager} from 'db://assets/Scripts/UI/ShakeManager'

const {ccclass, property} = _decorator

@ccclass('BattleManager')
export class BattleManager extends Component {
  private stage: Node
  private level: ILevel
  private smokeLayer: Node
  private isInit = false

  onLoad() {
    EventManager.Instance.on(EVENT_ENUM.NEXT_LEVEL, this.nextLevel, this)
    EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.checkArrived, this)
    EventManager.Instance.on(EVENT_ENUM.SHOW_SMOKE, this.generateSmoke, this)
    EventManager.Instance.on(EVENT_ENUM.RECORD_STEP, this.record, this)
    EventManager.Instance.on(EVENT_ENUM.REVOKE_STEP, this.revoke, this)
    EventManager.Instance.on(EVENT_ENUM.RESTART_LEVEL, this.initLevel, this)
    EventManager.Instance.on(EVENT_ENUM.OUT_BATTLE, this.outBattle, this)
  }

  onDestroy() {
    EventManager.Instance.off(EVENT_ENUM.NEXT_LEVEL, this.nextLevel)
    EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.checkArrived)
    EventManager.Instance.off(EVENT_ENUM.SHOW_SMOKE, this.generateSmoke)
    EventManager.Instance.off(EVENT_ENUM.RECORD_STEP, this.record)
    EventManager.Instance.off(EVENT_ENUM.REVOKE_STEP, this.revoke)
    EventManager.Instance.off(EVENT_ENUM.RESTART_LEVEL, this.initLevel)
    EventManager.Instance.off(EVENT_ENUM.OUT_BATTLE, this.outBattle)
  }


  async start() {
    this.generateStage()
    await this.initLevel()
  }

  private async initLevel() {
    const level = levels[`level${DataManager.Instance.levelIndex}`]
    if (level) {
      if (this.isInit) {
        await FaderManager.Instance.fadeIn()
      }
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
      // 这里后生成玩家是为了保证玩家的图层在最上层
      await this.generatePlayer()

      await FaderManager.Instance.fadeOut()
      this.isInit = true
    }
  }

  // 生成舞台
  private generateStage() {
    this.stage = createUINode()
    this.stage.setParent(this.node)
    this.stage.addComponent(ShakeManager)
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
    this.stage.getComponent(ShakeManager).stop()
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

  // 记录玩家操作
  record() {
    const item: IRecord = {
      player: {
        x: DataManager.Instance.player.x,
        y: DataManager.Instance.player.y,
        direction: DataManager.Instance.player.direction,
        // todo 有疑问
        state: DataManager.Instance.player.state === ENTITY_STATE_ENUM.DEATH
        || DataManager.Instance.player.state === ENTITY_STATE_ENUM.AIR_DEATH
          ? DataManager.Instance.player.state : ENTITY_STATE_ENUM.IDLE,
        type: DataManager.Instance.player.type
      },
      enemies: DataManager.Instance.enemies.map(enemy => {
        return {
          x: enemy.x,
          y: enemy.y,
          direction: enemy.direction,
          state: enemy.state,
          type: enemy.type
        }
      }),
      door: {
        x: DataManager.Instance.door.x,
        y: DataManager.Instance.door.y,
        state: DataManager.Instance.door.state,
        type: DataManager.Instance.door.type,
        direction: DataManager.Instance.door.direction
      },
      bursts: DataManager.Instance.busts.map(burst => {
        return {
          x: burst.x,
          y: burst.y,
          state: burst.state,
          type: burst.type,
          direction: burst.direction
        }
      }),
      spikes: DataManager.Instance.spikes.map(spike => {
        return {
          x: spike.x,
          y: spike.y,
          count: spike.count,
          type: spike.type
        }
      })
    }
    DataManager.Instance.records.push(item)
  }

  // 撤销操作
  revoke() {
    const record = DataManager.Instance.records.pop()
    if (record) {
      DataManager.Instance.player.x = DataManager.Instance.player.targetX = record.player.x
      DataManager.Instance.player.y = DataManager.Instance.player.targetY = record.player.y
      DataManager.Instance.player.direction = record.player.direction
      DataManager.Instance.player.state = record.player.state
      DataManager.Instance.player.type = record.player.type

      DataManager.Instance.door.x = record.door.x
      DataManager.Instance.door.y = record.door.y
      DataManager.Instance.door.state = record.door.state
      DataManager.Instance.door.type = record.door.type
      DataManager.Instance.door.direction = record.door.direction

      for (let i = 0; i < DataManager.Instance.enemies.length; i++) {
        const enemy = DataManager.Instance.enemies[i]
        enemy.x = record.enemies[i].x
        enemy.y = record.enemies[i].y
        enemy.direction = record.enemies[i].direction
        enemy.state = record.enemies[i].state
        enemy.type = record.enemies[i].type
      }

      for (let i = 0; i < DataManager.Instance.busts.length; i++) {
        const burst = DataManager.Instance.busts[i]
        burst.x = record.bursts[i].x
        burst.y = record.bursts[i].y
        burst.state = record.bursts[i].state
        burst.type = record.bursts[i].type
        burst.direction = record.bursts[i].direction
      }

      for (let i = 0; i < DataManager.Instance.spikes.length; i++) {
        const spike = DataManager.Instance.spikes[i]
        spike.x = record.spikes[i].x
        spike.y = record.spikes[i].y
        spike.count = record.spikes[i].count
        spike.type = record.spikes[i].type
      }
    }
  }

  // 回到开始界面
  async outBattle() {
    await FaderManager.Instance.fadeIn()
    director.loadScene(SCENE_ENUM.START)
  }

}


