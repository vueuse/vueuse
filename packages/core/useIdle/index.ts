import { ref } from 'vue-demi'
import { timestamp } from '@vueuse/shared'
import { useEventListener, WindowEventName } from '../useEventListener'
import { useThrottleFn } from '../useThrottleFn'
import { ConfigurableWindow, defaultWindow } from '../_configurable'

const defaultEvents: WindowEventName[] = ['mousemove', 'mousedown', 'resize', 'keydown', 'touchstart', 'wheel']
const oneMinute = 60_000

export interface IdleOptions extends ConfigurableWindow {
  /**
   * Event names that listen to for detected user activity
   *
   * @default ['mousemove', 'mousedown', 'resize', 'keydown', 'touchstart', 'wheel']
   */
  events?: WindowEventName[]
  /**
   * Listen for document visibility change
   *
   * @default true
   */
  listenForVisibilityChange?: boolean
  /**
   * Initial state of the ref idle
   *
   * @default false
   */
  initialState?: boolean
  /**
   * Throttle delay for receiving events (ms)
   *
   * @default 50
   */
  throttleDelay?: number
}

/**
 * Tracks whether the user is being inactive.
 *
 * @param timeout default to 1 minute
 * @param options IdleOptions
 */
export function useIdle(
  timeout: number = oneMinute,
  {
    initialState = false,
    listenForVisibilityChange = true,
    events = defaultEvents,
    throttleDelay = 50,
    window = defaultWindow,
  }: IdleOptions = {},
) {
  const idle = ref(initialState)
  const lastActive = ref(timestamp())

  let timer: any

  const set = (newState: boolean) => {
    idle.value = newState
  }

  const onEvent = useThrottleFn(
    () => {
      idle.value = false
      lastActive.value = timestamp()
      clearTimeout(timer)
      timer = setTimeout(() => idle.value = true, timeout)
    },
    throttleDelay,
  )

  if (window) {
    for (const event of events)
      useEventListener(window, event, onEvent)

    if (listenForVisibilityChange) {
      useEventListener(window.document, 'visibilitychange', () => {
        if (!window.document.hidden)
          onEvent()
      })
    }
  }

  timer = setTimeout(() => set(true), timeout)

  return { idle, lastActive }
}
