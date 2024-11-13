import { tryOnUnmounted } from '@vueuse/shared'
import { type Ref, ref } from 'vue-demi'

export function useInputCompositionState(): Ref<boolean> {
  const state = ref<boolean>(false)

  const handleEnd = () => {
    state.value = false
  }

  const handleStart = () => {
    state.value = true
  }

  window.addEventListener('compositionend', handleEnd)

  window.addEventListener('compositionstart', handleStart)

  tryOnUnmounted(() => {
    window.removeEventListener('compositionend', handleEnd)
    window.removeEventListener('compositionstart', handleStart)
  })

  return state
}
