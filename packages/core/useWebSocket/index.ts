/* this implementation is original ported from https://github.com/logaretm/vue-use-web by Abdelrahman Awad */

import { ref, Ref } from 'vue-demi'
import { tryOnUnmounted } from '@vueuse/shared'

export type WebSocketStatus = 'OPEN' | 'CONNECTING' | 'CLOSING' | 'CLOSED'

interface WebSocketOptions {
  url: string
  openCallBack?: (ws?: WebSocket) => void
  enablePing?: boolean
  pingMsg?: string
  pingIntervalSeconds?: number
  enableAutoReConnect?: boolean
  defaultMaxLoseMsgTimes?: number
}

/**
 * Reactive simple WebSocket client.
 *
 * @see   {@link https://vueuse.js.org/useWebSocket}
 * @param options
 */
export function useWebSocket(options: WebSocketOptions) {
  const {
    url,
    openCallBack,
    enablePing = true,
    pingMsg = 'ping',
    pingIntervalSeconds = 10,
    enableAutoReConnect = true,
    defaultMaxLoseMsgTimes = 5,
  } = options

  const data: Ref<any> = ref(null)
  const state = ref<WebSocketStatus>('CONNECTING')

  let ws: WebSocket
  let normalClose = false
  let lockReconnect = false
  let pingIntervalId: number
  let loseMsgTimes = 0

  const waitConnection = (state = WebSocket.OPEN, cb?: (ws: WebSocket) => void) => {
    if (ws.readyState === state && typeof cb === 'function')
      cb(ws)
    else
      setTimeout(() => { waitConnection(WebSocket.OPEN, cb) }, 100)
  }

  const ping = () => {
    pingIntervalId = setInterval(() => {
      loseMsgTimes += 1

      if (loseMsgTimes > defaultMaxLoseMsgTimes)
        closeSocket(false)
      else
        send(pingMsg)
    }, pingIntervalSeconds * 1000)
  }

  const reConnect: VoidFunction = () => {
    if (lockReconnect)
      return

    lockReconnect = true

    pingIntervalId && clearInterval(pingIntervalId)

    ws.close()

    waitConnection(WebSocket.CLOSED, () => ws = new WebSocket(url))
  }

  const close: typeof ws.close = function close(code, reason) {
    if (!ws) return

    normalClose = true

    ws.close(code, reason)
  }

  const closeSocket = (normal = true) => {
    normalClose = normal

    pingIntervalId && clearInterval(pingIntervalId)

    ws.close()
  }

  const send: typeof ws.send = function send(data) {
    if (!ws) return

    waitConnection(WebSocket.OPEN, () => {
      ws.send(data)
    })
  }

  ws = new WebSocket(url)
  ws.onopen = () => {
    state.value = 'OPEN'

    if (typeof openCallBack === 'function') openCallBack(ws)

    if (enablePing) ping()
  }

  ws.onclose = () => {
    state.value = 'CLOSED'

    if (enableAutoReConnect && !normalClose) reConnect()
  }

  ws.onerror = () => {
    state.value = 'CLOSED'
    normalClose = false

    if (enableAutoReConnect && !normalClose) reConnect()
  }

  ws.onmessage = (evt: MessageEvent) => {
    loseMsgTimes = 0

    data.value = evt.data
  }

  tryOnUnmounted(() => {
    ws.close()
  })

  return {
    data,
    state,
    close,
    send,
    ws,
  }
}
