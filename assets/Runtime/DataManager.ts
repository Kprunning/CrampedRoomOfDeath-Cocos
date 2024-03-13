import {ITiler} from '../Levels'
import Singleton from '../Base/Singleton'
import TileManager from '../Scripts/Tile/TileManager'

export default class DataManager extends Singleton {
  mapInfo: Array<Array<ITiler>>
  mapRowCount: number
  mapColumnCount: number
  levelIndex: number = 1
  tileInfo: Array<Array<TileManager>>

  static get Instance(): DataManager {
    return super.GetInstance<DataManager>()
  }

  reset() {
    this.mapInfo = []
    this.mapRowCount = 0
    this.mapColumnCount = 0
    this.tileInfo = []
  }
}