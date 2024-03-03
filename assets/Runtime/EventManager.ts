import Singleton from '../Base/Singleton'

interface ICTXFunc {
  func: Function,
  ctx: unknown
}


export default class EventManager extends Singleton {

  private eventDic: Map<string, Array<ICTXFunc>> = new Map<string, Array<ICTXFunc>>()

  static get Instance(): EventManager {
    return super.GetInstance<EventManager>()
  }


  on(eventName: string, func: Function, ctx?: unknown) {
    if (this.eventDic.has(eventName)) {
      this.eventDic.get(eventName).push({func, ctx})
    } else {
      this.eventDic.set(eventName, [{func, ctx}])
    }
  }

  off(eventName: string, func: Function) {
    if (this.eventDic.has(eventName)) {
      const funcArr = this.eventDic.get(eventName)
      const index = funcArr.findIndex(item => item.func === func)
      index > -1 && funcArr.splice(index, 1)
    }
  }

  emit(eventName: string, ...params: unknown[]) {
    if (this.eventDic.has(eventName)) {
      const funcArr = this.eventDic.get(eventName)
      funcArr.forEach(({ctx, func}) => {
        ctx ? func.apply(ctx, params) : func(...params)
      })
    }
  }

  clear() {
    this.eventDic.clear()
  }

}