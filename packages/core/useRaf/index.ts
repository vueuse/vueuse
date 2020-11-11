import { ref, computed } from 'vue-demi'
import { useNow } from '../useTimestamp'

export function useRaf() {
  const now = useNow()
  const startAt = ref(now.value)

  const elapsed = computed(() => {
    return now.value - startAt.value
  })

  return elapsed
}
