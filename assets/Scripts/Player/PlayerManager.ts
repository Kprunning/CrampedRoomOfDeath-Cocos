import {_decorator} from 'cc'
import {CTRL_DIRECTION_ENUM, DIRECTION_ENUM, ENTITY_STATE_ENUM, EVENT_ENUM} from '../../Enums'
import EventManager from '../../Runtime/EventManager'
import {PlayerStateMachine} from './PlayerStateMachine'
import EntityManager from '../../Base/EntityManager'
import DataManager from '../../Runtime/DataManager'
import TileManager from '../Tile/TileManager'
import {IEntity} from '../../Levels'

const {ccclass, property} = _decorator


@ccclass('PlayerManager')
export class PlayerManager extends EntityManager {
  private readonly speed = 1 / 10
  targetX = 0
  targetY = 0
  isMoving = false


  async init(params: IEntity) {
    this.fsm = this.addComponent(PlayerStateMachine)
    await this.fsm.init()
    super.init(params)
    this.targetX = this.x
    this.targetY = this.y
    EventManager.Instance.on(EVENT_ENUM.CTRL_DIRECTION, this.inputHandle, this)
    EventManager.Instance.on(EVENT_ENUM.ATTACK_PLAYER, this.onDead, this)
  }

  protected onDestroy() {
    super.onDestroy()
    EventManager.Instance.off(EVENT_ENUM.CTRL_DIRECTION, this.inputHandle)
    EventManager.Instance.off(EVENT_ENUM.ATTACK_PLAYER, this.onDead)
  }

  update() {
    this.updateXY()
    super.update()
  }

  move(ctrlDirection: CTRL_DIRECTION_ENUM) {
    switch (ctrlDirection) {
      case CTRL_DIRECTION_ENUM.BOTTOM:
        this.targetY++
        this.isMoving = true
        this.showSmoke(ctrlDirection)
        break
      case CTRL_DIRECTION_ENUM.TOP:
        this.targetY--
        this.isMoving = true
        this.showSmoke(ctrlDirection)
        break
      case CTRL_DIRECTION_ENUM.LEFT:
        this.targetX--
        this.isMoving = true
        this.showSmoke(ctrlDirection)
        break
      case CTRL_DIRECTION_ENUM.RIGHT:
        this.targetX++
        this.isMoving = true
        this.showSmoke(ctrlDirection)
        break
      case CTRL_DIRECTION_ENUM.TURN_LEFT:
        if (this.direction === DIRECTION_ENUM.TOP) {
          this.direction = DIRECTION_ENUM.LEFT
        } else if (this.direction === DIRECTION_ENUM.LEFT) {
          this.direction = DIRECTION_ENUM.BOTTOM
        } else if (this.direction === DIRECTION_ENUM.BOTTOM) {
          this.direction = DIRECTION_ENUM.RIGHT
        } else if (this.direction === DIRECTION_ENUM.RIGHT) {
          this.direction = DIRECTION_ENUM.TOP
        }
        this.state = ENTITY_STATE_ENUM.TURN_LEFT
        EventManager.Instance.emit(EVENT_ENUM.PLAYER_MOVE_END)
        break
      case CTRL_DIRECTION_ENUM.TURN_RIGHT:
        if (this.direction === DIRECTION_ENUM.TOP) {
          this.direction = DIRECTION_ENUM.RIGHT
        } else if (this.direction === DIRECTION_ENUM.LEFT) {
          this.direction = DIRECTION_ENUM.TOP
        } else if (this.direction === DIRECTION_ENUM.BOTTOM) {
          this.direction = DIRECTION_ENUM.LEFT
        } else if (this.direction === DIRECTION_ENUM.RIGHT) {
          this.direction = DIRECTION_ENUM.BOTTOM
        }
        this.state = ENTITY_STATE_ENUM.TURN_RIGHT
        EventManager.Instance.emit(EVENT_ENUM.PLAYER_MOVE_END)
        break
    }
  }

  updateXY() {
    if (this.x < this.targetX) {
      this.x += this.speed
    } else if (this.x > this.targetX) {
      this.x -= this.speed
    } else if (this.y < this.targetY) {
      this.y += this.speed
    } else if (this.y > this.targetY) {
      this.y -= this.speed
    }
    // 防止鬼畜乱动
    if (Math.abs(this.x - this.targetX) <= 0.1 && Math.abs(this.y - this.targetY) <= 0.1 && this.isMoving) {
      this.isMoving = false
      this.x = this.targetX
      this.y = this.targetY
      EventManager.Instance.emit(EVENT_ENUM.PLAYER_MOVE_END)
    }
  }

  private inputHandle(ctrlDirection: CTRL_DIRECTION_ENUM) {
    if (this.state === ENTITY_STATE_ENUM.DEATH || this.state === ENTITY_STATE_ENUM.AIR_DEATH) {
      return
    }

    if (this.isMoving) {
      return
    }

    const id = this.willAttack(ctrlDirection)
    if (id) {
      EventManager.Instance.emit(EVENT_ENUM.ATTACK_ENEMY, id)
      EventManager.Instance.emit(EVENT_ENUM.DOOR_OPEN)
      return
    }

    if (this.willBlock(ctrlDirection)) {
      return
    }
    this.move(ctrlDirection)
  }

  private willBlock(ctrlDirection: CTRL_DIRECTION_ENUM) {
    const {targetX: x, targetY: y, direction} = this
    const tileInfo = DataManager.Instance.tileInfo
    let playerNextX: number
    let playerNextY: number
    let weaponNextX: number
    let weaponNextY: number
    let weaponTurnX: number
    let weaponTurnY: number
    if ([CTRL_DIRECTION_ENUM.TOP, CTRL_DIRECTION_ENUM.BOTTOM, CTRL_DIRECTION_ENUM.LEFT, CTRL_DIRECTION_ENUM.RIGHT].indexOf(ctrlDirection) !== -1) {
      if (ctrlDirection === CTRL_DIRECTION_ENUM.TOP) {
        if (direction === DIRECTION_ENUM.TOP) {
          playerNextX = x
          playerNextY = y - 1
          weaponNextX = x
          weaponNextY = y - 2
        } else if (direction === DIRECTION_ENUM.BOTTOM) {
          playerNextX = x
          playerNextY = y - 1
          weaponNextX = x
          weaponNextY = y
        } else if (direction === DIRECTION_ENUM.RIGHT) {
          playerNextX = x
          playerNextY = y - 1
          weaponNextX = x + 1
          weaponNextY = y - 1
        } else if (direction === DIRECTION_ENUM.LEFT) {

          playerNextY = y - 1
          weaponNextX = x - 1
          weaponNextY = y - 1
        }
        if (playerNextY < 0) {
          return true
        }
      } else if (ctrlDirection === CTRL_DIRECTION_ENUM.BOTTOM) {
        if (direction === DIRECTION_ENUM.TOP) {
          playerNextX = x
          playerNextY = y + 1
          weaponNextX = x
          weaponNextY = y
        } else if (direction === DIRECTION_ENUM.BOTTOM) {
          playerNextX = x
          playerNextY = y + 1
          weaponNextX = x
          weaponNextY = y + 2
        } else if (direction === DIRECTION_ENUM.RIGHT) {
          playerNextX = x
          playerNextY = y + 1
          weaponNextX = x + 1
          weaponNextY = y + 1
        } else if (direction === DIRECTION_ENUM.LEFT) {
          playerNextX = x
          playerNextY = y + 1
          weaponNextX = x - 1
          weaponNextY = y + 1
        }
        if (playerNextY > tileInfo[x].length - 1) {
          return true
        }
      } else if (ctrlDirection === CTRL_DIRECTION_ENUM.LEFT) {
        if (direction === DIRECTION_ENUM.TOP) {
          playerNextX = x - 1
          playerNextY = y
          weaponNextX = x - 1
          weaponNextY = y - 1
        } else if (direction === DIRECTION_ENUM.BOTTOM) {
          playerNextX = x - 1
          playerNextY = y
          weaponNextX = x - 1
          weaponNextY = y + 1
        } else if (direction === DIRECTION_ENUM.RIGHT) {
          playerNextX = x - 1
          playerNextY = y
          weaponNextX = x
          weaponNextY = y
        } else if (direction === DIRECTION_ENUM.LEFT) {
          playerNextX = x - 1
          playerNextY = y
          weaponNextX = x - 2
          weaponNextY = y
        }
        if (playerNextX < 0) {
          return true
        }
      } else if (ctrlDirection === CTRL_DIRECTION_ENUM.RIGHT) {
        if (direction === DIRECTION_ENUM.TOP) {
          playerNextX = x + 1
          playerNextY = y
          weaponNextX = x + 1
          weaponNextY = y - 1
        } else if (direction === DIRECTION_ENUM.BOTTOM) {
          playerNextX = x + 1
          playerNextY = y
          weaponNextX = x + 1
          weaponNextY = y + 1
        } else if (direction === DIRECTION_ENUM.RIGHT) {
          playerNextX = x + 1
          playerNextY = y
          weaponNextX = x + 2
          weaponNextY = y
        } else if (direction === DIRECTION_ENUM.LEFT) {
          playerNextX = x + 1
          playerNextY = y
          weaponNextX = x
          weaponNextY = y
        }
        if (playerNextX > tileInfo.length - 1) {
          return true
        }
      }
      return this.checkMoveDirect(playerNextX, playerNextY, weaponNextX, weaponNextY, ctrlDirection)
    } else if (ctrlDirection === CTRL_DIRECTION_ENUM.TURN_LEFT) {
      if (direction === DIRECTION_ENUM.TOP) {
        weaponNextX = x - 1
        weaponNextY = y
        weaponTurnX = x - 1
        weaponTurnY = y - 1
      } else if (direction === DIRECTION_ENUM.BOTTOM) {
        weaponNextX = x + 1
        weaponNextY = y
        weaponTurnX = x + 1
        weaponTurnY = y + 1
      } else if (direction === DIRECTION_ENUM.RIGHT) {
        weaponNextX = x
        weaponNextY = y - 1
        weaponTurnX = x + 1
        weaponTurnY = y - 1
      } else if (direction === DIRECTION_ENUM.LEFT) {
        weaponNextX = x
        weaponNextY = y + 1
        weaponTurnX = x - 1
        weaponTurnY = y + 1
      }
      return this.checkTurn(weaponNextX, weaponNextY, weaponTurnX, weaponTurnY, ENTITY_STATE_ENUM.BLOCK_TURN_LEFT)
    } else if (ctrlDirection === CTRL_DIRECTION_ENUM.TURN_RIGHT) {
      if (direction === DIRECTION_ENUM.TOP) {
        weaponNextX = x + 1
        weaponNextY = y
        weaponTurnX = x + 1
        weaponTurnY = y - 1
      } else if (direction === DIRECTION_ENUM.BOTTOM) {
        weaponNextX = x - 1
        weaponNextY = y
        weaponTurnX = x - 1
        weaponTurnY = y + 1
      } else if (direction === DIRECTION_ENUM.RIGHT) {
        weaponNextX = x
        weaponNextY = y + 1
        weaponTurnX = x + 1
        weaponTurnY = y + 1
      } else if (direction === DIRECTION_ENUM.LEFT) {
        weaponNextX = x
        weaponNextY = y - 1
        weaponTurnX = x - 1
        weaponTurnY = y - 1
      }
      return this.checkTurn(weaponNextX, weaponNextY, weaponTurnX, weaponTurnY, ENTITY_STATE_ENUM.BLOCK_TURN_LEFT)
    }
    return false
  }

  // 直线移动时的检测
  private checkMoveDirect(playerNextX: number, playerNextY: number, weaponNextX: number, weaponNextY: number, ctrlDirection: CTRL_DIRECTION_ENUM) {
    const tileInfo = DataManager.Instance.tileInfo
    const playerNextTile: TileManager = tileInfo[playerNextX]?.[playerNextY]
    const weaponNextTile: TileManager = tileInfo[weaponNextX]?.[weaponNextY]

    // 检测是否经过地裂
    const bursts = DataManager.Instance.busts.filter(burst => burst.state !== ENTITY_STATE_ENUM.DEATH)
    for (let i = 0; i < bursts.length; i++) {
      const {x: burstX, y: burstY} = bursts[i]
      if ((playerNextX === burstX && playerNextY === burstY) && (!weaponNextTile || weaponNextTile.turnable)) {
        return false
      }
    }

    // 检测是否和门产生碰撞
    const {x: doorX, y: doorY, state: doorState} = DataManager.Instance.door
    if (doorState !== ENTITY_STATE_ENUM.DEATH && ((playerNextX === doorX && playerNextY === doorY) || (weaponNextX === doorX && weaponNextY === doorY))) {
      if (ctrlDirection === CTRL_DIRECTION_ENUM.BOTTOM) {
        this.state = ENTITY_STATE_ENUM.BLOCK_BACK
      } else if (ctrlDirection === CTRL_DIRECTION_ENUM.TOP) {
        this.state = ENTITY_STATE_ENUM.BLOCK_FRONT
      } else if (ctrlDirection === CTRL_DIRECTION_ENUM.LEFT) {
        this.state = ENTITY_STATE_ENUM.BLOCK_LEFT
      } else if (ctrlDirection === CTRL_DIRECTION_ENUM.RIGHT) {
        this.state = ENTITY_STATE_ENUM.BLOCK_RIGHT
      }
      return true
    }

    // 检测和敌人碰撞
    const enemies = DataManager.Instance.enemies.filter(enemy => enemy.state !== ENTITY_STATE_ENUM.DEATH)
    for (let i = 0; i < enemies.length; i++) {
      const enemy = enemies[i]
      const {x: enemyX, y: enemyY} = enemy
      if ((playerNextTile.x === enemyX && playerNextTile.y === enemyY) || (weaponNextX === enemyX && weaponNextY === enemyY)) {
        if (ctrlDirection === CTRL_DIRECTION_ENUM.BOTTOM) {
          this.state = ENTITY_STATE_ENUM.BLOCK_BACK
        } else if (ctrlDirection === CTRL_DIRECTION_ENUM.TOP) {
          this.state = ENTITY_STATE_ENUM.BLOCK_FRONT
        } else if (ctrlDirection === CTRL_DIRECTION_ENUM.LEFT) {
          this.state = ENTITY_STATE_ENUM.BLOCK_LEFT
        } else if (ctrlDirection === CTRL_DIRECTION_ENUM.RIGHT) {
          this.state = ENTITY_STATE_ENUM.BLOCK_RIGHT
        }
        return true
      }
    }

    // 普通地砖检测
    if (!(playerNextTile && playerNextTile.moveable && (!weaponNextTile || weaponNextTile.turnable))) {
      if (ctrlDirection === CTRL_DIRECTION_ENUM.BOTTOM) {
        this.state = ENTITY_STATE_ENUM.BLOCK_BACK
      } else if (ctrlDirection === CTRL_DIRECTION_ENUM.TOP) {
        this.state = ENTITY_STATE_ENUM.BLOCK_FRONT
      } else if (ctrlDirection === CTRL_DIRECTION_ENUM.LEFT) {
        this.state = ENTITY_STATE_ENUM.BLOCK_LEFT
      } else if (ctrlDirection === CTRL_DIRECTION_ENUM.RIGHT) {
        this.state = ENTITY_STATE_ENUM.BLOCK_RIGHT
      }
      return true
    }

    return false
  }

  private checkTurn(weaponNextX: number, weaponNextY: number, weaponTurnX: number, weaponTurnY: number, blockType: ENTITY_STATE_ENUM.BLOCK_TURN_LEFT | ENTITY_STATE_ENUM.BLOCK_TURN_RIGHT) {
    const tileInfo = DataManager.Instance.tileInfo
    const weaponTurnTile: TileManager = tileInfo[weaponTurnX][weaponTurnY]
    const weaponNextTile: TileManager = tileInfo[weaponNextX][weaponNextY]

    // 检测是否和门产生碰撞
    const {x: doorX, y: doorY, state: doorState} = DataManager.Instance.door
    if (doorState !== ENTITY_STATE_ENUM.DEATH &&
      ((weaponNextX === doorX && weaponNextY === doorY) || (weaponTurnX === doorX && weaponTurnY === doorY))) {
      this.state = blockType
      return true
    }

    // 检测和敌人碰撞
    const enemies = DataManager.Instance.enemies.filter(enemy => enemy.state !== ENTITY_STATE_ENUM.DEATH)
    for (let i = 0; i < enemies.length; i++) {
      const enemy = enemies[i]
      const {x: enemyX, y: enemyY} = enemy
      if ((weaponNextX === enemyX && weaponNextY === enemyY) || (weaponTurnX === enemyX && weaponTurnY === enemyY)) {
        this.state = blockType
        return true
      }
    }

    if (!((!weaponTurnTile || weaponTurnTile.turnable) && (!weaponNextTile || weaponNextTile.turnable))) {
      this.state = blockType
      return true
    }
    return false
  }


  private onDead(type: ENTITY_STATE_ENUM) {
    this.state = type
  }

  private willAttack(ctrlDirection: CTRL_DIRECTION_ENUM) {
    const enemies = DataManager.Instance.enemies.filter(item => item.state !== ENTITY_STATE_ENUM.DEATH)
    for (let i = 0; i < enemies.length; i++) {
      let enemy = enemies[i]
      const {x: enemyX, y: enemyY, id: enemyId} = enemy
      let attackX = 0
      let attackY = 0
      if (ctrlDirection === CTRL_DIRECTION_ENUM.TOP && this.direction === DIRECTION_ENUM.TOP) {
        attackX = this.x
        attackY = this.y - 2
      } else if (ctrlDirection === CTRL_DIRECTION_ENUM.BOTTOM && this.direction === DIRECTION_ENUM.BOTTOM) {
        attackX = this.x
        attackY = this.y + 2
      } else if (ctrlDirection === CTRL_DIRECTION_ENUM.LEFT && this.direction === DIRECTION_ENUM.LEFT) {
        attackX = this.x - 2
        attackY = this.y
      } else if (ctrlDirection === CTRL_DIRECTION_ENUM.RIGHT && this.direction === DIRECTION_ENUM.RIGHT) {
        attackX = this.x + 2
        attackY = this.y
      }
      if (enemyX === attackX && enemyY === attackY) {
        this.state = ENTITY_STATE_ENUM.ATTACK
        return enemyId
      }
    }
    return ''
  }

  private showSmoke(ctrlDirection: CTRL_DIRECTION_ENUM) {
    EventManager.Instance.emit(EVENT_ENUM.SHOW_SMOKE, this.x, this.y, ctrlDirection)
  }
}


