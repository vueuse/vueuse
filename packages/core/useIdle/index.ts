import { ref } from 'vue-demi'
import { timestamp } from '@vueuse/shared'
import { useEventListener, WindowEventName } from '../useEventListener'
import { useThrottleFn } from '../useThrottleFn'

const defaultEvents: WindowEventName[] = ['mousemove', 'mousedown', 'resize', 'keydown', 'touchstart', 'wheel']
const oneMinute = 60e3

export function useIdle(ms: number = oneMinute, initialState = false, listeningEvents: WindowEventName[] = defaultEvents, throttleDelay = 50) {
  const idle = ref(initialState)
  const lastActive = ref(timestamp())

  let timeout: any

  const set = (newState: boolean) => {
    idle.value = newState
  }

  const onEvent = useThrottleFn(() => {
    idle.value = false
    clearTimeout(timeout)
    timeout = setTimeout(() => idle.value = true, ms)
    lastActive.value = timestamp()
  }, throttleDelay)

  for (const eventName of listeningEvents)
    useEventListener(eventName, onEvent)

  useEventListener(document, 'visibilitychange', () => {
    if (!document.hidden)
      onEvent()
  }, undefined)

  timeout = setTimeout(() => set(true), ms)

  return { idle, lastActive }
}
