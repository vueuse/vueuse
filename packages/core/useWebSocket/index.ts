import type { Fn } from '@vueuse/shared'
import type { MaybeRefOrGetter, Ref, ShallowRef } from 'vue'
import { isClient, isWorker, toRef, tryOnScopeDispose, useIntervalFn } from '@vueuse/shared'
import { ref as deepRef, shallowRef, toValue, watch } from 'vue'
import { useEventListener } from '../useEventListener'

export type WebSocketStatus = 'OPEN' | 'CONNECTING' | 'CLOSED'
export type WebSocketHeartbeatMessage = string | ArrayBuffer | Blob

const DEFAULT_PING_MESSAGE = 'ping'

export interface UseWebSocketOptions {
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
    message?: MaybeRefOrGetter<WebSocketHeartbeatMessage>

    /**
     * Response message for the heartbeat, if undefined the message will be used
     */
    responseMessage?: MaybeRefOrGetter<WebSocketHeartbeatMessage>

    /**
     * Interval, in milliseconds
     *
     * @default 1000
     */
    interval?: number

    /**
     * Heartbeat response timeout, in milliseconds
     *
     * @default 1000
     */
    pongTimeout?: number
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
    retries?: number | ((retried: number) => boolean)

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
   * Immediately open the connection when calling this composable
   *
   * @default true
   */
  immediate?: boolean

  /**
   * Automatically connect to the websocket when URL changes
   *
   * @default true
   */
  autoConnect?: boolean

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

export interface UseWebSocketReturn<T> {
  /**
   * Reference to the latest data received via the websocket,
   * can be watched to respond to incoming messages
   */
  data: Ref<T | null>

  /**
   * The current websocket status, can be only one of:
   * 'OPEN', 'CONNECTING', 'CLOSED'
   */
  status: ShallowRef<WebSocketStatus>

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
  url: MaybeRefOrGetter<string | URL | undefined>,
  options: UseWebSocketOptions = {},
): UseWebSocketReturn<Data> {
  const {
    onConnected,
    onDisconnected,
    onError,
    onMessage,
    immediate = true,
    autoConnect = true,
    autoClose = true,
    protocols = [],
  } = options

  const data: Ref<Data | null> = deepRef(null)
  const status = shallowRef<WebSocketStatus>('CLOSED')
  const wsRef = deepRef<WebSocket | undefined>()
  const urlRef = toRef(url)

  let heartbeatPause: Fn | undefined
  let heartbeatResume: Fn | undefined

  let explicitlyClosed = false
  let retried = 0

  let bufferedData: (string | ArrayBuffer | Blob)[] = []

  let retryTimeout: ReturnType<typeof setTimeout> | undefined
  let pongTimeoutWait: ReturnType<typeof setTimeout> | undefined

  const _sendBuffer = () => {
    if (bufferedData.length && wsRef.value && status.value === 'OPEN') {
      for (const buffer of bufferedData)
        wsRef.value.send(buffer)
      bufferedData = []
    }
  }

  const resetRetry = () => {
    if (retryTimeout != null) {
      clearTimeout(retryTimeout)
      retryTimeout = undefined
    }
  }

  const resetHeartbeat = () => {
    clearTimeout(pongTimeoutWait)
    pongTimeoutWait = undefined
  }

  // Status code 1000 -> Normal Closure https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent/code
  const close: WebSocket['close'] = (code = 1000, reason) => {
    resetRetry()
    if ((!isClient && !isWorker) || !wsRef.value)
      return
    explicitlyClosed = true
    resetHeartbeat()
    heartbeatPause?.()
    wsRef.value.close(code, reason)
    wsRef.value = undefined
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
    if (explicitlyClosed || typeof urlRef.value === 'undefined')
      return

    const ws = new WebSocket(urlRef.value, protocols)
    wsRef.value = ws
    status.value = 'CONNECTING'

    ws.onopen = () => {
      status.value = 'OPEN'
      retried = 0
      onConnected?.(ws!)
      heartbeatResume?.()
      _sendBuffer()
    }

    ws.onclose = (ev) => {
      status.value = 'CLOSED'
      resetHeartbeat()
      heartbeatPause?.()
      onDisconnected?.(ws, ev)

      if (!explicitlyClosed && options.autoReconnect && (wsRef.value == null || ws === wsRef.value)) {
        const {
          retries = -1,
          delay = 1000,
          onFailed,
        } = resolveNestedOptions(options.autoReconnect)

        const checkRetires = typeof retries === 'function'
          ? retries
          : () => typeof retries === 'number' && (retries < 0 || retried < retries)

        if (checkRetires(retried)) {
          retried += 1
          retryTimeout = setTimeout(_init, delay)
        }
        else {
          onFailed?.()
        }
      }
    }

    ws.onerror = (e) => {
      onError?.(ws!, e)
    }

    ws.onmessage = (e: MessageEvent) => {
      if (options.heartbeat) {
        resetHeartbeat()
        const {
          message = DEFAULT_PING_MESSAGE,
          responseMessage = message,
        } = resolveNestedOptions(options.heartbeat)
        if (e.data === toValue(responseMessage))
          return
      }

      data.value = e.data
      onMessage?.(ws!, e)
    }
  }

  if (options.heartbeat) {
    const {
      message = DEFAULT_PING_MESSAGE,
      interval = 1000,
      pongTimeout = 1000,
    } = resolveNestedOptions(options.heartbeat)

    const { pause, resume } = useIntervalFn(
      () => {
        send(toValue(message), false)
        if (pongTimeoutWait != null)
          return
        pongTimeoutWait = setTimeout(() => {
          // auto-reconnect will be trigger with ws.onclose()
          close()
          explicitlyClosed = false
        }, pongTimeout)
      },
      interval,
      { immediate: false },
    )

    heartbeatPause = pause
    heartbeatResume = resume
  }

  if (autoClose) {
    if (isClient)
      useEventListener('beforeunload', () => close(), { passive: true })
    tryOnScopeDispose(close)
  }

  const open = () => {
    if (!isClient && !isWorker)
      return

    close()
    explicitlyClosed = false
    retried = 0
    _init()
  }

  if (immediate)
    open()

  if (autoConnect)
    watch(urlRef, open)

  return {
    data,
    status,
    close,
    send,
    open,
    ws: wsRef,
  }
}
