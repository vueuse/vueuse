import { onUnmounted, ref } from '../api'
import { isClient } from '../utils'

export function useWindowScroll () {
  const x = ref(isClient ? window.pageXOffset : 0)
  const y = ref(isClient ? window.pageYOffset : 0)

  const handler = () => {
    x.value = window.pageXOffset
    y.value = window.pageYOffset
  }

  window.addEventListener('scroll', handler, {
    capture: false,
    passive: true,
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handler)
  })

  return { x, y }
}
