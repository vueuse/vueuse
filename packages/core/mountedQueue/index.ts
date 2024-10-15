import { ref, onMounted, onUnmounted } from 'vue-demi'

export function useMountedQueue() {
  const isMounted = ref(false)
  const queue: { fn: () => void; priority: number }[] = []

  onMounted(() => {
    isMounted.value = true
    executeQueue()
  })

  onUnmounted(() => {
    isMounted.value = false
  })

  const executeQueue = () => {
    queue
      .sort((a, b) => b.priority - a.priority)
      .forEach(({ fn }) => {
        try {
          fn()
        } catch (error) {
          console.error('Error executing function in queue:', error)
        }
      })
    queue.length = 0
  }

  const addQueue = (fn: () => void, priority = 0) => {
    if (isMounted.value) {
      try {
        fn()
      } catch (error) {
        console.error('Error executing function:', error)
      }
    } else {
      queue.push({ fn, priority })
    }
  }

  const removeQueue = (fn: () => void) => {
    const index = queue.findIndex((item) => item.fn === fn)
    if (index !== -1) {
      queue.splice(index, 1)
    }
  }

  return {
    addQueue,
    removeQueue
  }
}
