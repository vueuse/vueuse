import { ref } from 'vue-demi'
import type { MaybeRef } from '@vueuse/shared'

export interface ColorOptions {
  type?: 'RGB' | 'RGBA' | 'HEX' | 'HSV' | 'HSL' | 'HSLA'
  initialValue?: MaybeRef<string>
}

export function useRandomColor(options: ColorOptions = {}) {
  const {
    type = 'HEX',
    initialValue = options?.initialValue ?? '#66CCFF',
  } = options
  const color = ref(initialValue)
  let changeColor = () => (color.value = randomHEXColor())
  if (type.toUpperCase() === 'HEX') {
    color.value = randomHEXColor()
    changeColor = () => (color.value = randomHEXColor())
  }
  else if (type.toUpperCase() === 'RGB') {
    color.value = randomRGBColor()
    changeColor = () => (color.value = randomRGBColor())
  }
  else if (type.toUpperCase() === 'RGBA') {
    color.value = randomRGBAColor()
    changeColor = () => (color.value = randomRGBAColor())
  }
  else if (type.toUpperCase() === 'HSV') {
    color.value = randomHSVColor()
    changeColor = () => (color.value = randomHSVColor())
  }
  else if (type.toUpperCase() === 'HSL') {
    color.value = randomHSLColor()
    changeColor = () => (color.value = randomHSLColor())
  }
  else if (type.toUpperCase() === 'HSLA') {
    color.value = randomHSLAColor()
    changeColor = () => (color.value = randomHSLAColor())
  }

  return { color, changeColor }
}

function randomHEXColor() {
  return `#${(`00000${(Math.random() * 0x1000000 << 0).toString(16)}`).substr(-6)}`
}

function randomHSVColor() {
  const h = Math.random() * 360
  const s = Math.random() * 100
  const v = Math.random() * 100
  return `hsv(${h}, ${s}%, ${v}%)`
}

function randomHSLColor() {
  const h = Math.random() * 360
  const s = Math.random() * 100
  const l = Math.random() * 100
  return `hsl(${h}, ${s}%, ${l}%)`
}

function randomHSLAColor() {
  const h = Math.random() * 360
  const s = Math.random() * 100
  const l = Math.random() * 100
  const a = Math.random() * 100
  return `hsla(${h}, ${s}%, ${l}%, ${a}%)`
}

function randomRGBColor() {
  const r = Math.floor(Math.random() * 256)
  const g = Math.floor(Math.random() * 256)
  const b = Math.floor(Math.random() * 256)
  return `rgb(${r},${g},${b})`
}
function randomRGBAColor() {
  const r = Math.floor(Math.random() * 256)
  const g = Math.floor(Math.random() * 256)
  const b = Math.floor(Math.random() * 256)
  const alpha = Math.random()
  return `rgb(${r},${g},${b},${alpha})`
}

