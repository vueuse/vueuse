import { ref } from 'vue-demi'
import { useRafFn } from '@vueuse/core'

export function useFPS(options?: {
  every?: number
}) {
  const fps = ref(0)

  const every = options?.every ?? 10

  let last = performance.now()
  let ticks = 0
  useRafFn(() => {
    if (++ticks === every) {
      const now = performance.now()
      const diff = now - last
      fps.value = Math.round(1000 / (diff / every))
      last = now
      ticks = 0
    }
  })

  return fps
}
