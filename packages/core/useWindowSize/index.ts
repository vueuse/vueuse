import { ref } from 'vue-demi'
import { isClient } from '../utils'
import { useEventListener } from '../useEventListener'

export function useWindowSize(initialWidth = Infinity, initialHeight = Infinity) {
  const width = ref(isClient ? window.innerWidth : initialWidth)
  const height = ref(isClient ? window.innerHeight : initialHeight)

  if (isClient) {
    useEventListener('resize', () => {
      width.value = window.innerWidth
      height.value = window.innerHeight
    })
  }

  return { width, height }
}
