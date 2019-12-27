import { off, on, throttle, timestamp } from '../utils'
import { ref, onUnmounted } from '../api'

const defaultEvents = ['mousemove', 'mousedown', 'resize', 'keydown', 'touchstart', 'wheel']
const oneMinute = 60e3

export function useIdle (ms: number = oneMinute, initialState = false, events: string[] = defaultEvents, throttleDelay = 50) {
  const idle = ref(initialState)
  const lastActive = ref(timestamp())

  let mounted = true
  let timeout: any

  const set = (newState: boolean) => {
    if (mounted)
      idle.value = newState
  }

  const onEvent = throttle(throttleDelay, () => {
    idle.value = false
    clearTimeout(timeout)
    timeout = setTimeout(() => set(true), ms)
    lastActive.value = timestamp()
  })

  const onVisibility = () => {
    if (!document.hidden)
      onEvent()
  }

  for (let i = 0; i < events.length; i++)
    on(window, events[i], onEvent)

  on(document, 'visibilitychange', onVisibility)

  timeout = setTimeout(() => set(true), ms)

  onUnmounted(() => {
    mounted = false

    for (let i = 0; i < events.length; i++)
      off(window, events[i], onEvent)

    off(document, 'visibilitychange', onVisibility)
  })

  return { idle, lastActive }
}
