import { type MaybeRefOrGetter, toValue } from '@vueuse/shared'
import { ref } from 'vue-demi'
import { useEventListener } from '../useEventListener'

/**
 * Make elements draggable scrolling.
 *
 * @see https://vueuse.org/useDragScroll
 */
export function useDragScroll(target: MaybeRefOrGetter<HTMLElement | null | undefined>) {
  let lastClientX: number
  let lastClientY: number
  const isScrolling = ref(false)
  useEventListener(target, 'mousedown', (e) => {
    isScrolling.value = true
    e.preventDefault()
    lastClientX = e.clientX
    lastClientY = e.clientY
  })

  useEventListener('mouseup', () => {
    isScrolling.value = false
  })

  useEventListener('mousemove', (e) => {
    if (!isScrolling.value)
      return false
    const { clientX, clientY } = e
    const el = toValue(target)!
    el.scrollBy(lastClientX - clientX, lastClientY - clientY)
    lastClientX = clientX
    lastClientY = clientY
  })

  return {
    isScrolling,
  }
}
