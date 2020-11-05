import { ref } from 'vue-demi'
import { useEventListener } from '../useEventListener'
import { ConfigurableWindow, defaultWindow } from '../_configurable'

export interface MouseOptions extends ConfigurableWindow {
  touch?: boolean
  resetOnTouchEnds?: boolean
  initial?: {x: number; y: number}
}

export function useMouse(options: MouseOptions = {}) {
  const {
    touch = true,
    resetOnTouchEnds = true,
    initial = { x: 0, y: 0 },
    window = defaultWindow,
  } = options

  const x = ref(initial.x)
  const y = ref(initial.y)

  if (window) {
    useEventListener(window, 'mousemove', (event) => {
      x.value = event.pageX
      y.value = event.pageY
    })

    if (touch) {
      useEventListener(window, 'touchmove', (event) => {
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
  }

  return {
    x,
    y,
  }
}
