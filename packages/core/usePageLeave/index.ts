import { ref } from 'vue-demi'
import { useEventListener } from '../useEventListener'

export function usePageLeave() {
  const isLeft = ref(false)

  const handler = (event: MouseEvent) => {
    event = event || (window.event as any)
    // @ts-ignore
    const from = event.relatedTarget || event.toElement
    isLeft.value = !from
  }

  useEventListener('mouseout', handler)

  return isLeft
}
