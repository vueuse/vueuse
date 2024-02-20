import type { MaybeRefOrGetter, Ref } from 'vue-demi'
import { ref, shallowRef, watch } from 'vue-demi'
import { isClient, toRef, tryOnScopeDispose } from '@vueuse/shared'
import type { Fn } from '@vueuse/shared'
import { useEventListener } from '../useEventListener'

export type EventSourceStatus = 'CONNECTING' | 'OPEN' | 'CLOSED'

export interface UseEventSourceOptions extends EventSourceInit {
  /**
   * Enabled auto reconnect
   *
   * @default false
   */
  autoReconnect?: boolean | {
    /**
     * Maximum retry times.
     *
     * Or you can pass a predicate function (which returns true if you want to retry).
     *
     * @default -1
     */
    retries?: number | (() => boolean)

    /**
     * Delay for reconnect, in milliseconds
     *
     * @default 1000
     */
    delay?: number

    /**
     * On maximum retry times reached.
     */
    onFailed?: Fn
  }

  /**
   * Automatically open a connection
   *
   * @default true
   */
  immediate?: boolean
}

export interface UseEventSourceReturn<Events extends string[]> {
  /**
   * Reference to the latest data received via the EventSource,
   * can be watched to respond to incoming messages
   */
  data: Ref<string | null>

  /**
   * The current state of the connection, can be only one of:
   * 'CONNECTING', 'OPEN' 'CLOSED'
   */
  status: Ref<EventSourceStatus>

  /**
   * The latest named event
   */
  event: Ref<Events[number] | null>

  /**
   * The current error
   */
  error: Ref<Event | null>

  /**
   * Closes the EventSource connection gracefully.
   */
  close: EventSource['close']

  /**
   * Reopen the EventSource connection.
   * If there the current one is active, will close it before opening a new one.
   */
  open: Fn

  /**
   * Reference to the current EventSource instance.
   */
  eventSource: Ref<EventSource | null>
}

function resolveNestedOptions<T>(options: T | true): T {
  if (options === true)
    return {} as T
  return options
}

/**
 * Reactive wrapper for EventSource.
 *
 * @see https://vueuse.org/useEventSource
 * @see https://developer.mozilla.org/en-US/docs/Web/API/EventSource/EventSource EventSource
 * @param url
 * @param events
 * @param options
 */
export function useEventSource<Events extends string[]>(
  url: MaybeRefOrGetter<string | URL | undefined>,
  events: Events = [] as unknown as Events,
  options: UseEventSourceOptions = {},
): UseEventSourceReturn<Events> {
  const event: Ref<string | null> = ref(null)
  const data: Ref<string | null> = ref(null)
  const status = ref('CONNECTING') as Ref<EventSourceStatus>
  const eventSource = ref(null) as Ref<EventSource | null>
  const error = shallowRef(null) as Ref<Event | null>
  const urlRef = toRef(url)

  let explicitlyClosed = false
  let retried = 0

  const {
    withCredentials = false,
    immediate = true,
  } = options

  const close = () => {
    if (isClient && eventSource.value) {
      eventSource.value.close()
      eventSource.value = null
      status.value = 'CLOSED'
      explicitlyClosed = true
    }
  }

  const _init = () => {
    if (explicitlyClosed || typeof urlRef.value === 'undefined')
      return

    const es = new EventSource(urlRef.value, { withCredentials })

    status.value = 'CONNECTING'

    eventSource.value = es

    es.onopen = () => {
      status.value = 'OPEN'
      error.value = null
    }

    es.onerror = (e) => {
      status.value = 'CLOSED'
      error.value = e

      // only reconnect if EventSource isn't reconnecting by itself
      // this is the case when the connection is closed (readyState is 2)
      if (es.readyState === 2 && !explicitlyClosed && options.autoReconnect) {
        es.close()
        const {
          retries = -1,
          delay = 1000,
          onFailed,
        } = resolveNestedOptions(options.autoReconnect)
        retried += 1

        if (typeof retries === 'number' && (retries < 0 || retried < retries))
          setTimeout(_init, delay)
        else if (typeof retries === 'function' && retries())
          setTimeout(_init, delay)
        else
          onFailed?.()
      }
    }

    es.onmessage = (e: MessageEvent) => {
      event.value = null
      data.value = e.data
    }

    for (const event_name of events) {
      useEventListener(es, event_name, (e: Event & { data?: string }) => {
        event.value = event_name
        data.value = e.data || null
      })
    }
  }

  const open = () => {
    if (!isClient)
      return
    close()
    explicitlyClosed = false
    retried = 0
    _init()
  }

  if (immediate)
    watch(urlRef, open, { immediate: true })

  tryOnScopeDispose(close)

  return {
    eventSource,
    event,
    data,
    status,
    error,
    open,
    close,
  }
}
