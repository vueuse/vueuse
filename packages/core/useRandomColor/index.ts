import { ref } from 'vue-demi'
import type { MaybeRef } from '@vueuse/shared'

export interface ColorOptions {
  type?: 'RGB' | 'RGBA' | 'HEX'
  initialValue?: MaybeRef<string>
}

export function useRandomColor(options: ColorOptions = {}) {
  const {
    type = 'HEX',
    initialValue = options?.initialValue ?? '#66CCFF',
  } = options
  const color = ref(initialValue)
  let changeColor = () => (color.value = randomHEXColor())
  if (type === 'HEX') {
    color.value = randomHEXColor()
    changeColor = () => (color.value = randomHEXColor())
  }
  else if (type === 'RGB') {
    color.value = randomRGBColor()
    changeColor = () => (color.value = randomRGBColor())
  }
  else if (type === 'RGBA') {
    color.value = randomRGBAColor()
    changeColor = () => (color.value = randomRGBAColor())
  }

  return { color, changeColor }
}
// function randomHEXColor() { // 随机生成十六进制颜色
//   let hex = Math.floor(Math.random() * 16777216).toString(16) // 生成ffffff以内16进制数
//   while (hex.length < 6) { // while循环判断hex位数，少于6位前面加0凑够6位
//     hex = `0${hex}`
//   }
//   return `#${hex}` // 返回‘#’开头16进制颜色
// }

function randomHEXColor() { // 随机生成十六进制颜色
  return `#${(`00000${(Math.random() * 0x1000000 << 0).toString(16)}`).substr(-6)}`
}
function randomRGBColor() { // 随机生成RGB颜色
  const r = Math.floor(Math.random() * 256) // 随机生成256以内r值
  const g = Math.floor(Math.random() * 256) // 随机生成256以内g值
  const b = Math.floor(Math.random() * 256) // 随机生成256以内b值
  return `rgb(${r},${g},${b})` // 返回rgb(r,g,b)格式颜色
}
function randomRGBAColor() { // 随机生成RGBA颜色
  const r = Math.floor(Math.random() * 256) // 随机生成256以内r值
  const g = Math.floor(Math.random() * 256) // 随机生成256以内g值
  const b = Math.floor(Math.random() * 256) // 随机生成256以内b值
  const alpha = Math.random() // 随机生成1以内a值
  return `rgb(${r},${g},${b},${alpha})` // 返回rgba(r,g,b,a)格式颜色
}

