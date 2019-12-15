import { ref, getCurrentInstance, onUnmounted } from '@vue/composition-api'

function getTimestamp () {
  return +Date.now()
}

export function useNow () {
  const now = ref(getTimestamp())
  let id: number | undefined

  const start = () => {
    if (id === undefined) {
      id = requestAnimationFrame(() => {
        now.value = getTimestamp()
      })
    }
  }

  const stop = () => {
    if (id !== undefined) {
      cancelAnimationFrame(id)
      id = undefined
    }
  }

  start()

  if (getCurrentInstance())
    onUnmounted(() => stop())

  return now
}
