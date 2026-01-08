import type { ConfigurableEventFilter, Stoppable, TimerHandle } from '@vueuse/shared'
import type { ShallowRef } from 'vue'
import type { ConfigurableWindow } from '../_configurable'
import type { WindowEventName } from '../useEventListener'
import { createFilterWrapper, throttleFilter, timestamp } from '@vueuse/shared'
import { shallowReadonly, shallowRef } from 'vue'
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

export interface UseIdleReturn extends Stoppable {
  idle: ShallowRef<boolean>
  lastActive: ShallowRef<number>
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
  const idle = shallowRef(initialState)
  const lastActive = shallowRef(timestamp())
  const isPending = shallowRef(false)

  let timer: TimerHandle

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

    for (const event of events) {
      useEventListener(window, event, () => {
        if (!isPending.value)
          return
        onEvent()
      }, listenerOptions)
    }

    if (listenForVisibilityChange) {
      useEventListener(document, 'visibilitychange', () => {
        if (document.hidden || !isPending.value)
          return
        onEvent()
      }, listenerOptions)
    }

    start()
  }

  function start() {
    if (isPending.value) {
      return
    }
    isPending.value = true
    if (!initialState)
      reset()
  }
  function stop() {
    idle.value = initialState
    clearTimeout(timer)
    isPending.value = false
  }

  return {
    idle,
    lastActive,
    reset,
    stop,
    start,
    isPending: shallowReadonly(isPending),
  }
}
