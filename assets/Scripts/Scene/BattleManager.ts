import { _decorator, Component, Node } from 'cc';
import {TileMapManager} from '../Tile/TileMapManager'
const { ccclass, property } = _decorator;

@ccclass('BattleManager')
export class BattleManager extends Component {
    start() {
        this.generateTileMap()
    }

    private generateTileMap() {
        // 生成舞台
        const stage = new Node()
        stage.setParent(this.node)
        // 生成地图
        const tileMap = new Node()
        tileMap.setParent(this.node)
        const tileMapComponent = tileMap.addComponent(TileMapManager)
        tileMapComponent.init()
    }
}


