import {Layers, Node, UITransform} from 'cc'


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