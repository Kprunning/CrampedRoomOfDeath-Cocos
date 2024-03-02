import Singleton from '../Base/Singleton'
import {resources, SpriteFrame} from 'cc'

export default class ResourceManager extends Singleton {

  static get Instance(): ResourceManager {
    return super.GetInstance<ResourceManager>()
  }

  loadDir(path: string, type: typeof SpriteFrame = SpriteFrame) {
    return new Promise<SpriteFrame[]>((resolve, reject) => {
      resources.loadDir(path, type, function (err, assets) {
        if (err) {
          reject(err)
        } else {
          resolve(assets)
        }
      })
    })
  }

}