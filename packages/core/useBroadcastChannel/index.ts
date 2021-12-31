import { tryOnMounted, ref } from 'vue-demi'
import { tryOnScopeDispose } from '@vueuse/shared'

export interface UseBroadcastChannelOptions {
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
export const useBroadcastChannel = (options: UseBroadcastChannelOptions) => {
  const {
    name,
  } = options

  const isSupported = window && 'BroadcastChannel' in window

  const channel = ref<BroadcastChannel | undefined>()
  const data = ref()
  const error = ref<Event | null>(null)
  
  const isClosed = ref(false)
  const post = (data: unknown) => {
    if (channel.value)
    channel.value.postMessage(data)
  }
  

  const close = () => {
    if (channel.value) 
      channel.value.close()
    isClosed.value = true
  }

  if (isSupported)
  tryOnMounted(() => {
    error.value = null
    channel.value = new BroadcastChannel(name)

    channel.value.addEventListener('message', (e: MessageEvent) => {
      data.value = e.data
    }, { passive: true})

    channel.value.addEventListener('messageerror', (e: MessageEvent) => {
      error.value = e
    }, { passive: true,})

    channel.value.addEventListener('close', () => {
      isClosed.value = true
    })
  })

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

export type UseBroadcastChannelReturn = ReturnType<typeof useBroadcastChannel>
