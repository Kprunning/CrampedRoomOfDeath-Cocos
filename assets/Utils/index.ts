import {Layers, Node, SpriteFrame, UITransform} from 'cc'


export function createUINode(name: string = '') {
  const node = new Node(name)
  const transform = node.addComponent(UITransform)
  transform.setAnchorPoint(0, 1)
  // 设置图层
  node.layer = 1 << Layers.nameToLayer('UI_2D')
  return node
}


export function randomByRange(start: number, end: number) {
  return Math.floor(start + (end - start) * Math.random())
}

const reg = /\((\d+)\)/

function getSpriteFrameNum(name: string) {
  return parseInt(name.match(reg)[1] || '0')
}

// 对动画帧排序,防止网络请求导致的乱序
export function sortSpriteFrames(spriteFrames: SpriteFrame[]) {
  return spriteFrames.sort((a, b) => {
    return getSpriteFrameNum(a.name) - getSpriteFrameNum(b.name)
  })
}
