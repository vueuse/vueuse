import { ref } from '../../api'
import { useEventListener } from '../useEventListener'

export function useMouse(options: {
  touch?: boolean
  resetOnTouchEnds?: boolean
  initial?: {x: number; y: number}
} = {}) {
  const {
    touch = true,
    resetOnTouchEnds = true,
    initial = { x: 0, y: 0 },
  } = options

  const x = ref(initial.x)
  const y = ref(initial.y)

  useEventListener('mousemove', (event) => {
    x.value = event.pageX
    y.value = event.pageY
  })

  if (touch) {
    useEventListener('touchmove', (event) => {
      if (event.touches.length > 0) {
        x.value = event.touches[0].clientX
        y.value = event.touches[0].clientY
      }
    })
    if (resetOnTouchEnds) {
      useEventListener('touchend', () => {
        x.value = initial.x
        y.value = initial.y
      })
    }
  }

  return {
    x,
    y,
  }
}
