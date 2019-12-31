import { ref } from '../api'
import { useEventListener } from '../useEventListener'

export function useMouse () {
  const x = ref(0)
  const y = ref(0)

  useEventListener('mousemove', (event: MouseEvent) => {
    x.value = event.pageX
    y.value = event.pageY
  })

  return {
    x,
    y,
  }
}
