import { ref, Ref, tryOnMounted, tryOnUnMounted } from 'vue-demi'
import { useEventListener } from '../useEventListener'

// EventSource Constructor
// https://developer.mozilla.org/en-US/docs/Web/API/EventSource/EventSource
export function useEventSource(url: string, events: Array<string> = []) {
  const data: Ref<{ event: string | null, data: string | null }> = ref({ event: null, data: null })
  const state = ref('CONNECTING') as Ref<'OPEN' | 'CONNECTING' | 'CLOSED'>
  let es: EventSource
  const close = () => {
    es?.close()
  }

  tryOnMounted (() => {
    es = new EventSource(url)
    es.onopen = () => {
      state.value = 'OPEN'
    }

    es.close = es.onerror = () => {
      state.value = 'CLOSED'
    }

    es.onmessage = (e: MessageEvent) => {
      data.value = {event: null, data: e.data}
    }

    for (let i = 0; i < events.length; i++) {
      const event_name: string = events[i]
      useEventListener(event_name, (_e: Event & {data?: string}) => {
        data.value = {event: event_name, data: data}
      })
    }
  })

  tryOnUnMounted (() => {   
    close()
  })

  return {
    data,
    state,
    close,
  }
}
