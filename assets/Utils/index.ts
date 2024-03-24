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



/**
 * 生成UUID
 * @param len 生成长度
 * @param radix 基数
 * @returns {string} 生成结果
 */
export function generateUUID(len, radix) {
  let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  let uuid = [], i;
  radix = radix || chars.length;
  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
  } else {
    // rfc4122, version 4 form
    let r;
    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';
    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random()*16;
        uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
      }
    }
  }
  return uuid.join('');
}