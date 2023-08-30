import type { Ref } from 'vue-demi'
import { ref, shallowRef } from 'vue-demi'
import type { MaybeRefOrGetter } from '@vueuse/shared'
import { toValue, tryOnScopeDispose, watchWithFilter } from '@vueuse/shared'

export type UseEventSourceOptions = EventSourceInit & {
  /**
   * Connect eventsource immediate after calling this function.
   *
   * @default true
   */
  immediate?: boolean

  onConnected?: (es: Event) => void
  onError?: (es: EventSource, event: Event) => void
  onMessage?: (es: EventSource, event: MessageEvent) => void
}

export interface UseEventSourceReturn {
  data: Ref<string | null>
  status: Ref<'OPEN' | 'CONNECTING' | 'CLOSED'>
  eventSource: Ref<EventSource | null>
  error: Ref<Event | null>

  open: () => void
  close: () => void
}

/**
 * Reactive wrapper for EventSource.
 *
 * @see https://vueuse.org/useEventSource
 * @see https://developer.mozilla.org/en-US/docs/Web/API/EventSource/EventSource EventSource
 * @param url
 * @param options
 */
export function useEventSource(url: MaybeRefOrGetter<string>, options: UseEventSourceOptions = {}): UseEventSourceReturn {
  const data: Ref<string | null> = ref(null)
  const status = ref('CLOSED') as Ref<'OPEN' | 'CONNECTING' | 'CLOSED'>
  const eventSource = ref(null) as Ref<EventSource | null>
  const error = shallowRef(null) as Ref<Event | null>

  const {
    onConnected = () => {},
    onMessage = () => {},
    onError = () => {},
    immediate = true,
    withCredentials = false,
  } = options

  const updateStatus = () => {
    status.value = eventSource.value?.readyState === EventSource.OPEN
      ? 'OPEN'
      : eventSource.value?.readyState === EventSource.CONNECTING
        ? 'CONNECTING'
        : 'CLOSED'
  }

  const close = () => {
    if (eventSource.value) {
      data.value = null
      eventSource.value.close()
      eventSource.value = null
      updateStatus()
    }
  }

  const open = () => {
    close()
    eventSource.value = new EventSource(toValue(url), { withCredentials })
    updateStatus()

    eventSource.value.onopen = (e) => {
      updateStatus()
      error.value = null
      onConnected(e)
    }

    eventSource.value.onerror = (e) => {
      updateStatus()
      error.value = e
      onError(eventSource.value!, e)
    }

    eventSource.value.onmessage = (e: MessageEvent) => {
      data.value = e.data
      onMessage(eventSource.value!, e)
    }
  }

  watchWithFilter(() => toValue(url), () => open(), {
    immediate,
    eventFilter: invoke => immediate && invoke(),
  })

  tryOnScopeDispose(close)

  return {
    eventSource,
    data,
    status,
    error,
    open,
    close,
  }
}
