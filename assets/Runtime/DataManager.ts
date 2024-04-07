import {ITiler} from '../Levels'
import Singleton from '../Base/Singleton'
import TileManager from '../Scripts/Tile/TileManager'
import {PlayerManager} from '../Scripts/Player/PlayerManager'
import EnemyManager from '../Base/EnemyManager'
import {DoorManager} from '../Scripts/Door/DoorManager'
import BurstManager from '../Scripts/Burst/BurstManager'
import SpikesManager from '../Scripts/Spikes/SpikesManager'
import SmokeManager from '../Scripts/Smoke/SmokeManager'

export default class DataManager extends Singleton {
  mapInfo: Array<Array<ITiler>>
  mapRowCount: number
  mapColumnCount: number
  levelIndex: number = 1
  tileInfo: Array<Array<TileManager>>
  player: PlayerManager
  enemies: EnemyManager[]
  door: DoorManager
  busts: BurstManager[]
  spikes: SpikesManager[]
  smokes: SmokeManager[]

  static get Instance(): DataManager {
    return super.GetInstance<DataManager>()
  }

  reset() {
    this.mapInfo = []
    this.mapRowCount = 0
    this.mapColumnCount = 0
    this.tileInfo = []
    this.player = null
    this.door = null
    this.enemies = []
    this.spikes = []
    this.busts = []
    this.smokes = []
  }
}
