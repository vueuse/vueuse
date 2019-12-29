import { throttle, timestamp } from '../utils'
import { ref, onMounted } from '../api'
import { useEventListener } from '../useEventListener'

const defaultEvents = ['mousemove', 'mousedown', 'resize', 'keydown', 'touchstart', 'wheel']
const oneMinute = 60e3

export function useIdle (ms: number = oneMinute, initialState = false, listeningEvents: string[] = defaultEvents, throttleDelay = 50) {
  const idle = ref(initialState)
  const lastActive = ref(timestamp())

  let timeout: any

  const set = (newState: boolean) => {
    idle.value = newState
  }

  const onEvent = throttle(throttleDelay, () => {
    idle.value = false
    clearTimeout(timeout)
    timeout = setTimeout(() => idle.value = true, ms)
    lastActive.value = timestamp()
  })

  for (const eventName of listeningEvents)
    useEventListener(eventName, onEvent)

  useEventListener('visibilitychange', () => {
    if (!document.hidden)
      onEvent()
  }, undefined, document)

  onMounted(() => {
    timeout = setTimeout(() => set(true), ms)
  })

  return { idle, lastActive }
}
