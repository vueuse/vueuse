import { ref, onMounted, onUnmounted, Ref } from 'vue-demi'

export function useEventSource(url: string) {
  const data: Ref<any> = ref(null)
  const state = ref('CONNECTING') as Ref<'OPEN' | 'CONNECTING' | 'CLOSED'>
  let es: EventSource
  const close = () => {
    es?.close()
  }

  onMounted(() => {
    es = new EventSource(url)
    es.onopen = () => {
      state.value = 'OPEN'
    }

    es.close = es.onerror = () => {
      state.value = 'CLOSED'
    }

    es.onmessage = (e: MessageEvent) => {
      data.value = e.data
    }
  })

  onUnmounted(() => {
    close()
  })

  return {
    data,
    state,
    close,
  }
}
