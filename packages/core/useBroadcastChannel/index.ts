import type { ShallowRef } from 'vue'
import type { ConfigurableWindow } from '../_configurable'
import type { Supportable } from '../types'
import { tryOnMounted, tryOnScopeDispose } from '@vueuse/shared'
import { shallowRef } from 'vue'
import { defaultWindow } from '../_configurable'
import { useEventListener } from '../useEventListener'
import { useSupported } from '../useSupported'

export interface UseBroadcastChannelOptions extends ConfigurableWindow {
  /**
   * The name of the channel.
   */
  name: string
}

/**
 * Reactive BroadcastChannel
 *
 * @see https://vueuse.org/useBroadcastChannel
 * @see https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel
 * @param options
 *
 */
export function useBroadcastChannel<D, P>(options: UseBroadcastChannelOptions): UseBroadcastChannelReturn<D, P> {
  const {
    name,
    window = defaultWindow,
  } = options

  const isSupported = useSupported(() => window && 'BroadcastChannel' in window)
  const isClosed = shallowRef(false)

  const channel = shallowRef<BroadcastChannel | undefined>()
  const data = shallowRef()
  const error = shallowRef<Event | null>(null)

  const post = (data: unknown) => {
    if (channel.value)
      channel.value.postMessage(data)
  }

  const close = () => {
    if (channel.value)
      channel.value.close()
    isClosed.value = true
  }

  if (isSupported.value) {
    tryOnMounted(() => {
      error.value = null
      channel.value = new BroadcastChannel(name)

      const listenerOptions = {
        passive: true,
      }

      useEventListener(channel, 'message', (e: MessageEvent) => {
        data.value = e.data
      }, listenerOptions)

      useEventListener(channel, 'messageerror', (e: MessageEvent) => {
        error.value = e
      }, listenerOptions)

      useEventListener(channel, 'close', () => {
        isClosed.value = true
      }, listenerOptions)
    })
  }

  tryOnScopeDispose(() => {
    close()
  })

  return {
    isSupported,
    channel,
    data,
    post,
    close,
    error,
    isClosed,
  }
}

export interface UseBroadcastChannelReturn<D, P> extends Supportable {
  channel: ShallowRef<BroadcastChannel | undefined>
  data: ShallowRef<D>
  post: (data: P) => void
  close: () => void
  error: ShallowRef<Event | null>
  isClosed: ShallowRef<boolean>
}
