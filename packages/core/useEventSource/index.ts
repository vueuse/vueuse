import type { Ref } from 'vue-demi'
import { ref, shallowRef } from 'vue-demi'
import { tryOnScopeDispose } from '@vueuse/shared'
import { useEventListener } from '../useEventListener'

export type UseEventSourceOptions = EventSourceInit

/**
 * Reactive wrapper for EventSource.
 *
 * @see https://vueuse.org/useEventSource
 * @see https://developer.mozilla.org/en-US/docs/Web/API/EventSource/EventSource EventSource
 * @param url
 * @param events
 * @param options
 */
export function useEventSource(url: string, events: Array<string> = [], options: UseEventSourceOptions = {}) {
  const event: Ref<string | null> = ref(null)
  const data: Ref<string | null> = ref(null)
  const status = ref('CONNECTING') as Ref<'OPEN' | 'CONNECTING' | 'CLOSED'>
  const eventSource = ref(null) as Ref<EventSource | null>
  const error = shallowRef(null) as Ref<Event | null>

  const {
    withCredentials = false,
  } = options

  const close = () => {
    if (eventSource.value) {
      eventSource.value.close()
      eventSource.value = null
      status.value = 'CLOSED'
    }
  }

  const es = new EventSource(url, { withCredentials })

  eventSource.value = es

  es.onopen = () => {
    status.value = 'OPEN'
    error.value = null
  }

  es.onerror = (e) => {
    status.value = 'CLOSED'
    error.value = e
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

  tryOnScopeDispose(() => {
    close()
  })

  return {
    eventSource,
    event,
    data,
    status,
    error,
    close,
  }
}

export type UseEventSourceReturn = ReturnType<typeof useEventSource>
