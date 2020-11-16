import { ref } from 'vue-demi'
import { ConfigurableEventFilter, createFilterWrapper, throttleFilter, timestamp } from '@vueuse/shared'
import { useEventListener, WindowEventName } from '../useEventListener'
import { ConfigurableWindow, defaultWindow } from '../_configurable'

const defaultEvents: WindowEventName[] = ['mousemove', 'mousedown', 'resize', 'keydown', 'touchstart', 'wheel']
const oneMinute = 60_000

export interface IdleOptions extends ConfigurableWindow, ConfigurableEventFilter {
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
}

/**
 * Tracks whether the user is being inactive.
 *
 * @see   {@link https://vueuse.js.org/useIdle}
 * @param timeout default to 1 minute
 * @param options IdleOptions
 */
export function useIdle(
  timeout: number = oneMinute,
  options: IdleOptions = {},
) {
  const {
    initialState = false,
    listenForVisibilityChange = true,
    events = defaultEvents,
    window = defaultWindow,
    eventFilter = throttleFilter(50),
  } = options
  const idle = ref(initialState)
  const lastActive = ref(timestamp())

  let timer: any

  const onEvent = createFilterWrapper(
    eventFilter,
    () => {
      idle.value = false
      lastActive.value = timestamp()
      clearTimeout(timer)
      timer = setTimeout(() => idle.value = true, timeout)
    },
  )

  if (window) {
    const document = window.document
    for (const event of events)
      useEventListener(window, event, onEvent)

    if (listenForVisibilityChange) {
      useEventListener(document, 'visibilitychange', () => {
        if (!document.hidden)
          onEvent()
      })
    }
  }

  timer = setTimeout(() => idle.value = true, timeout)

  return { idle, lastActive }
}
