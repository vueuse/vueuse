import { ref } from 'vue-demi'

export function useMouse(options: {
  touch?: boolean
  resetOnTouchEnds?: boolean
  initial?: {x: number; y: number}
} = {}) {
  const {
    initial = { x: 0, y: 0 },
  } = options

  const x = ref(initial.x)
  const y = ref(initial.y)

  return {
    x,
    y,
  }
}
