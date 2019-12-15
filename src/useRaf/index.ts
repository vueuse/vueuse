import { ref, computed } from '@vue/composition-api'
import { useNow } from '../useNow'

export function useRaf () {
  const now = useNow()
  const startAt = ref(now.value)

  const elapsed = computed(() => {
    return now.value - startAt.value
  })

  return elapsed
}
