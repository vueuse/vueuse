import type { ConfigurableEventFilter, MaybeRefInitials, ReadonlyRefs, Stoppable, TimerHandle } from '@vueuse/shared'
import type { ConfigurableWindow } from '../_configurable'
import type { WindowEventName } from '../useEventListener'
import { createFilterWrapper, throttleFilter, timestamp } from '@vueuse/shared'
import { shallowReadonly, shallowRef } from 'vue'
import { defaultWindow } from '../_configurable'
import { useEventListener } from '../useEventListener'

const defaultEvents: WindowEventName[] = ['mousemove', 'mousedown', 'resize', 'keydown', 'touchstart', 'wheel']
const oneMinute = 60_000

export interface UseIdleState {
  /**
   * Whether the user is idle. Also the value `stop()` resets to.
   *
   * @default false
   */
  idle: boolean
  /**
   * Timestamp of the last user activity
   *
   * @default Date.now()
   */
  lastActive: number
}

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
   * Initial values for the returned state.
   * A passed ref is used as the internal state.
   */
  initials?: MaybeRefInitials<UseIdleState>
  /**
   * @deprecated Use `initials.idle` instead. Will be removed in v17.
   */
  initialState?: boolean
}

export interface UseIdleReturn extends Stoppable, ReadonlyRefs<UseIdleState> {
  /**
   * Restart the idle timer.
   *
   * @param resetLastActive also set `lastActive` to now, as user activity does
   * @default false
   */
  reset: (resetLastActive?: boolean) => void
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
    initialState: deprecatedInitialState,
    initials: {
      idle: initialIdle = deprecatedInitialState ?? false,
      lastActive: initialLastActive = timestamp(),
    } = {},
    listenForVisibilityChange = true,
    events = defaultEvents,
    window = defaultWindow,
    eventFilter = throttleFilter(50),
  } = options
  const idle = shallowRef(initialIdle)
  const lastActive = shallowRef(initialLastActive)
  // snapshot, as `stop()` resets to it even when a ref is passed
  const initialState = idle.value
  const isPending = shallowRef(false)

  let timer: TimerHandle

  const reset = (resetLastActive = false) => {
    if (resetLastActive)
      lastActive.value = timestamp()
    idle.value = false
    clearTimeout(timer)
    timer = setTimeout(() => idle.value = true, timeout)
  }

  const onEvent = createFilterWrapper(
    eventFilter,
    () => reset(true),
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
    idle: shallowReadonly(idle),
    lastActive: shallowReadonly(lastActive),
    reset,
    stop,
    start,
    isPending: shallowReadonly(isPending),
  }
}
