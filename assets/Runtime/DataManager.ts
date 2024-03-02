import {ITiler} from '../Levels'
import Singleton from '../Base/Singleton'

export default class DataManager extends Singleton{
  mapInfo: Array<Array<ITiler>>
  mapRowCount: number
  mapColumnCount: number

  static get Instance():DataManager {
    return super.GetInstance<DataManager>()
  }
}