import { timestamp, tryOnUnmounted } from '@vueuse/shared'
import { ref } from 'vue-demi'

export function useNow() {
  const now = ref(timestamp())
  let started = false

  const update = () => {
    requestAnimationFrame(() => {
      now.value = timestamp()
      if (started)
        update()
    })
  }

  const start = () => {
    if (!started) {
      started = true
      update()
    }
  }

  const stop = () => {
    started = false
  }

  start()

  tryOnUnmounted(stop)

  return now
}
