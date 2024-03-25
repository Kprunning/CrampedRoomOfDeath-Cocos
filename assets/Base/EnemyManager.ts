import {_decorator} from 'cc'
import EntityManager from './EntityManager'
import EventManager from '../Runtime/EventManager'
import {DIRECTION_ENUM, ENTITY_STATE_ENUM, EVENT_ENUM} from '../Enums'
import DataManager from '../Runtime/DataManager'
import {IEntity} from '../Levels'

const {ccclass, property} = _decorator


@ccclass('EnemyManager')
export default class EnemyManager extends EntityManager {

  async init(params: IEntity) {
    super.init(params)

    EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.focusPlayerMove, this)
    EventManager.Instance.on(EVENT_ENUM.PLAYER_BORN, this.focusPlayerMove, this)
    EventManager.Instance.on(EVENT_ENUM.ATTACK_ENEMY, this.onDead, this)

    // 保证初始情况面向玩家
    this.focusPlayerMove(true)
  }

  onDestroy() {
    super.onDestroy()
    EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.focusPlayerMove)
    EventManager.Instance.off(EVENT_ENUM.PLAYER_BORN, this.focusPlayerMove)
    EventManager.Instance.off(EVENT_ENUM.ATTACK_ENEMY, this.onDead)
  }

  private focusPlayerMove(playerBorn: boolean = false) {
    if (this.state === ENTITY_STATE_ENUM.DEATH) {
      return
    }
    const player = DataManager.Instance.player
    if (!player) {
      return
    }
    const {x: playerX, y: playerY} = player
    const disX = Math.abs(this.x - playerX)
    const disY = Math.abs(this.y - playerY)

    if (disX === disY && !playerBorn) {
      return
    }

    if (this.x <= playerX && this.y >= playerY) {
      // 第一象限
      this.direction = disX > disY ? DIRECTION_ENUM.RIGHT : DIRECTION_ENUM.TOP
    } else if (this.x >= playerX && this.y >= playerY) {
      // 第二象限
      this.direction = disX > disY ? DIRECTION_ENUM.LEFT : DIRECTION_ENUM.TOP
    } else if (this.x >= playerX && this.y <= playerY) {
      // 第三象限
      this.direction = disX > disY ? DIRECTION_ENUM.LEFT : DIRECTION_ENUM.BOTTOM
    } else if (this.x <= playerX && this.y <= playerY) {
      // 第四象限
      this.direction = disX > disY ? DIRECTION_ENUM.RIGHT : DIRECTION_ENUM.BOTTOM
    }

  }


  private onDead(id: string) {
    if (this.state === ENTITY_STATE_ENUM.DEATH) {
      return
    }

    if (id === this.id) {
      this.state = ENTITY_STATE_ENUM.DEATH
    }
  }
}


