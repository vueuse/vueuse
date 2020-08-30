/* this implementation is original ported from https://github.com/logaretm/vue-use-web by Abdelrahman Awad */

import { ref, Ref } from 'vue-demi'
import { tryOnMounted, tryOnUnmounted } from '../utils'

export function useWebSocket(url: string) {
  const data: Ref<any> = ref(null)
  const state = ref('CONNECTING') as Ref<'OPEN' | 'CONNECTING' | 'CLOSING' | 'CLOSED'>
  let ws: WebSocket
  const close: typeof ws.close = function close(code, reason) {
    if (!ws) return

    ws.close(code, reason)
  }

  const send: typeof ws.send = function send(data) {
    if (!ws) return

    ws.send(data)
  }

  tryOnMounted(() => {
    ws = new WebSocket(url)
    ws.onopen = () => {
      state.value = 'OPEN'
    }

    ws.onclose = ws.onerror = () => {
      state.value = 'CLOSED'
    }

    ws.onmessage = (e: MessageEvent) => {
      data.value = e.data
    }
  })

  tryOnUnmounted(() => {
    ws.close()
  })

  return {
    data,
    state,
    close,
    send,
  }
}
