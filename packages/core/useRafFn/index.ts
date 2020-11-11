import { tryOnUnmounted } from '@vueuse/shared'
import { ref } from 'vue-demi'

export function useRafFn(fn: () => any, options: { immediate?: boolean } = {}) {
  const { immediate = true } = options

  const isActive = ref(false)

  function loop() {
    if (!isActive.value)
      return
    fn()
    requestAnimationFrame(loop)
  }

  function resume() {
    if (!isActive.value) {
      isActive.value = true
      loop()
    }
  }

  function pause() {
    isActive.value = false
  }

  if (immediate)
    resume()

  tryOnUnmounted(() => pause())

  return { isActive, pause, resume }
}
