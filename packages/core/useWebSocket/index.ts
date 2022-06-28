import type { Ref } from 'vue-demi'
import { ref } from 'vue-demi'
import type { Fn } from '@vueuse/shared'
import { tryOnScopeDispose, useIntervalFn } from '@vueuse/shared'
import { useEventListener } from '../useEventListener'

export type WebSocketStatus = 'OPEN' | 'CONNECTING' | 'CLOSED'

export interface WebSocketOptions {
  onConnected?: (ws: WebSocket) => void
  onDisconnected?: (ws: WebSocket, event: CloseEvent) => void
  onError?: (ws: WebSocket, event: Event) => void
  onMessage?: (ws: WebSocket, event: MessageEvent) => void

  /**
   * Send heartbeat for every x milliseconds passed
   *
   * @default false
   */
  heartbeat?: boolean | {
    /**
     * Message for the heartbeat
     *
     * @default 'ping'
     */
    message?: string

    /**
     * Interval, in milliseconds
     *
     * @default 1000
     */
    interval?: number
  }

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

  /**
   * Automatically close a connection
   *
   * @default true
   */
  autoClose?: boolean

  /**
   * List of one or more sub-protocol strings
   *
   * @default []
   */
  protocols?: string[]
}

export interface WebSocketResult<T> {
  /**
   * Reference to the latest data received via the websocket,
   * can be watched to respond to incoming messages
   */
  data: Ref<T | null>

  /**
   * The current websocket status, can be only one of:
   * 'OPEN', 'CONNECTING', 'CLOSED'
   */
  status: Ref<WebSocketStatus>

  /**
   * Closes the websocket connection gracefully.
   */
  close: WebSocket['close']

  /**
   * Reopen the websocket connection.
   * If there the current one is active, will close it before opening a new one.
   */
  open: Fn

  /**
   * Sends data through the websocket connection.
   *
   * @param data
   * @param useBuffer when the socket is not yet open, store the data into the buffer and sent them one connected. Default to true.
   */
  send: (data: string | ArrayBuffer | Blob, useBuffer?: boolean) => boolean

  /**
   * Reference to the WebSocket instance.
   */
  ws: Ref<WebSocket | undefined>
}

function resolveNestedOptions<T>(options: T | true): T {
  if (options === true)
    return {} as T
  return options
}

/**
 * Reactive WebSocket client.
 *
 * @see https://vueuse.org/useWebSocket
 * @param url
 */
export function useWebSocket<Data = any>(
  url: string,
  options: WebSocketOptions = {},
): WebSocketResult<Data> {
  const {
    onConnected,
    onDisconnected,
    onError,
    onMessage,
    immediate = true,
    autoClose = true,
    protocols = [],
  } = options

  const data: Ref<Data | null> = ref(null)
  const status = ref<WebSocketStatus>('CONNECTING')
  const wsRef = ref<WebSocket | undefined>()

  let heartbeatPause: Fn | undefined
  let heartbeatResume: Fn | undefined

  let explicitlyClosed = false
  let retried = 0

  let bufferedData: (string | ArrayBuffer | Blob)[] = []

  // Status code 1000 -> Normal Closure https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent/code
  const close: WebSocket['close'] = (code = 1000, reason) => {
    if (!wsRef.value)
      return
    explicitlyClosed = true
    heartbeatPause?.()
    wsRef.value.close(code, reason)
  }

  const _sendBuffer = () => {
    if (bufferedData.length && wsRef.value && status.value === 'OPEN') {
      for (const buffer of bufferedData)
        wsRef.value.send(buffer)
      bufferedData = []
    }
  }

  const send = (data: string | ArrayBuffer | Blob, useBuffer = true) => {
    if (!wsRef.value || status.value !== 'OPEN') {
      if (useBuffer)
        bufferedData.push(data)
      return false
    }
    _sendBuffer()
    wsRef.value.send(data)
    return true
  }

  const _init = () => {
    const ws = new WebSocket(url, protocols)
    wsRef.value = ws
    status.value = 'CONNECTING'
    explicitlyClosed = false

    ws.onopen = () => {
      status.value = 'OPEN'
      onConnected?.(ws!)
      heartbeatResume?.()
      _sendBuffer()
    }

    ws.onclose = (ev) => {
      status.value = 'CLOSED'
      wsRef.value = undefined
      onDisconnected?.(ws, ev)

      if (!explicitlyClosed && options.autoReconnect) {
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

    ws.onerror = (e) => {
      onError?.(ws!, e)
    }

    ws.onmessage = (e: MessageEvent) => {
      data.value = e.data
      onMessage?.(ws!, e)
    }
  }

  if (options.heartbeat) {
    const {
      message = 'ping',
      interval = 1000,
    } = resolveNestedOptions(options.heartbeat)

    const { pause, resume } = useIntervalFn(
      () => send(message, false),
      interval,
      { immediate: false },
    )

    heartbeatPause = pause
    heartbeatResume = resume
  }

  if (immediate)
    _init()

  if (autoClose) {
    useEventListener(window, 'beforeunload', () => close())
    tryOnScopeDispose(close)
  }

  const open = () => {
    close()
    retried = 0
    _init()
  }

  return {
    data,
    status,
    close,
    send,
    open,
    ws: wsRef,
  }
}
