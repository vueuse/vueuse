import { onUnmounted, ref } from '../api'
import { isClient } from '../utils'

export function useWindowSize (initialWidth = Infinity, initialHeight = Infinity) {
  const width = ref(isClient ? window.innerWidth : initialWidth)
  const height = ref(isClient ? window.innerWidth : initialHeight)

  if (isClient) {
    const handler = () => {
      width.value = window.innerWidth
      height.value = window.innerHeight
    }

    window.addEventListener('resize', handler)

    onUnmounted(() => {
      window.removeEventListener('resize', handler)
    })
  }

  return { width, height }
}
