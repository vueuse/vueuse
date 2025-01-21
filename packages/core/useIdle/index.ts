import type { ConfigurableEventFilter } from '@vueuse/shared'
import type { Ref } from 'vue'
import type { ConfigurableWindow } from '../_configurable'
import type { WindowEventName } from '../useEventListener'
import { createFilterWrapper, throttleFilter, timestamp } from '@vueuse/shared'
import { ref } from 'vue'
import { defaultWindow } from '../_configurable'
import { useEventListener } from '../useEventListener'

const defaultEvents: WindowEventName[] = ['mousemove', 'mousedown', 'resize', 'keydown', 'touchstart', 'wheel']
const oneMinute = 60_000

export interface UseIdleOptions extends ConfigurableWindow, ConfigurableEventFilter {
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

export interface UseIdleReturn {
  idle: Ref<boolean>
  lastActive: Ref<number>
  reset: () => void
}

/**
 * Tracks whether the user is being inactive.
 *
 * @see https://vueuse.org/useIdle
 * @param timeout default to 1 minute
 * @param options IdleOptions
 */
export function useIdle(
  timeout: number = oneMinute,
  options: UseIdleOptions = {},
): UseIdleReturn {
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

  const reset = () => {
    idle.value = false
    clearTimeout(timer)
    timer = setTimeout(() => idle.value = true, timeout)
  }

  const onEvent = createFilterWrapper(
    eventFilter,
    () => {
      lastActive.value = timestamp()
      reset()
    },
  )

  if (window) {
    const document = window.document
    const listenerOptions = { passive: true }

    for (const event of events)
      useEventListener(window, event, onEvent, listenerOptions)

    if (listenForVisibilityChange) {
      useEventListener(document, 'visibilitychange', () => {
        if (!document.hidden)
          onEvent()
      }, listenerOptions)
    }

    reset()
  }

  return {
    idle,
    lastActive,
    reset,
  }
}
