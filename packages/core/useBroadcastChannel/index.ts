import type { ComputedRef, Ref } from 'vue'
import type { ConfigurableWindow } from '../_configurable'
import { tryOnMounted, tryOnScopeDispose } from '@vueuse/shared'
import { ref, shallowRef } from 'vue'
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
  const isClosed = ref(false)

  const channel = ref<BroadcastChannel | undefined>()
  const data = ref()
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

export interface UseBroadcastChannelReturn<D, P> {
  isSupported: ComputedRef<boolean>
  channel: Ref<BroadcastChannel | undefined>
  data: Ref<D>
  post: (data: P) => void
  close: () => void
  error: Ref<Event | null>
  isClosed: Ref<boolean>
}
