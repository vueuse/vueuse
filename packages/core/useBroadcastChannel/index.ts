import { computed, onUnmounted, onMounted, ref } from 'vue-demi'

export interface BroadcastChannelOptions {
  /**
   *
   * The name of the channel.
   *
   */
  name: string
}

/**
 *
 * reactive useBroadcastChannel()
 *
 * @see https://vueuse.org/useBroadcastChannel
 * @see https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel
 * @param options
 *
 */
export const useBroadcastChannel = (options: BroadcastChannelOptions) => {
  const {
    name,
  } = options

  const isSupported = window && 'BroadcastChannel' in window

  const bc = ref<BroadcastChannel | undefined>()

  const data = ref()

  const closed = ref(false)

  const error = ref<Event | null>(null)

  const isError = computed(() => {
    return !!error.value
  })

  const post = (data: unknown) => {
    if (bc.value) bc.value.postMessage(data)
  }

  const close = () => {
    if (bc.value) bc.value.close()
    closed.value = true
  }

  onMounted(() => {
    if (isSupported) {
      bc.value = new BroadcastChannel(name)

      bc.value.addEventListener('message', (e: MessageEvent) => data.value = e.data, {
        passive: true,
      })

      bc.value.addEventListener('messageerror', (e: MessageEvent) => error.value = e, {
        passive: true,
      })
    }
  })

  onUnmounted(() => {
    close()
  })

  return {
    isSupported,
    bc,
    data,
    post,
    close,
    closed,
    error,
    isError,
  }
}

export type UseBroadcastChannelReturn = ReturnType<typeof useBroadcastChannel>
