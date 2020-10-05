import { ref } from 'vue-demi'
import { timestamp } from '../../_utils'
import { useEventListener } from '../useEventListener'
import { useThrottleFn } from '../useThrottleFn'
import { tryOnMounted } from '../utils'

const defaultEvents = ['mousemove', 'mousedown', 'resize', 'keydown', 'touchstart', 'wheel']
const oneMinute = 60e3

export function useIdle(ms: number = oneMinute, initialState = false, listeningEvents: string[] = defaultEvents, throttleDelay = 50) {
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

  useEventListener('visibilitychange', () => {
    if (!document.hidden)
      onEvent()
  }, undefined, document)

  tryOnMounted(() => {
    timeout = setTimeout(() => set(true), ms)
  })

  return { idle, lastActive }
}
