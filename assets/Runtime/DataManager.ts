import {ITiler} from '../Levels'
import Singleton from '../Base/Singleton'
import TileManager from '../Scripts/Tile/TileManager'
import {PlayerManager} from '../Scripts/Player/PlayerManager'
import WoodenSkeletonManager from '../Scripts/WoodenSkeleton/WoodenSkeletonManager'

export default class DataManager extends Singleton {
  mapInfo: Array<Array<ITiler>>
  mapRowCount: number
  mapColumnCount: number
  levelIndex: number = 1
  tileInfo: Array<Array<TileManager>>
  player: PlayerManager
  enemies: WoodenSkeletonManager[]

  static get Instance(): DataManager {
    return super.GetInstance<DataManager>()
  }

  reset() {
    this.mapInfo = []
    this.mapRowCount = 0
    this.mapColumnCount = 0
    this.tileInfo = []
    this.player = null
    this.enemies = []
  }
}
