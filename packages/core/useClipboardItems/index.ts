import type { MaybeRefOrGetter } from '@vueuse/shared'
import { toValue, useTimeoutFn } from '@vueuse/shared'
import type { ComputedRef, Ref } from 'vue-demi'
import { ref } from 'vue-demi'
import { useEventListener } from '../useEventListener'
import { useSupported } from '../useSupported'
import type { ConfigurableNavigator } from '../_configurable'
import { defaultNavigator } from '../_configurable'

export interface UseClipboardItemsOptions<Source> extends ConfigurableNavigator {
  /**
   * Enabled reading for clipboard
   *
   * @default false
   */
  read?: boolean

  /**
   * Copy source
   */
  source?: Source

  /**
   * Milliseconds to reset state of `copied` ref
   *
   * @default 1500
   */
  copiedDuring?: number
}

export interface UseClipboardItemsReturn<Optional> {
  isSupported: Ref<boolean>
  content: ComputedRef<ClipboardItems>
  copied: ComputedRef<boolean>
  copy: Optional extends true ? (content?: ClipboardItems) => Promise<void> : (text: ClipboardItems) => Promise<void>
}

/**
 * Reactive Clipboard API.
 *
 * @see https://vueuse.org/useClipboardItems
 * @param options
 */
export function useClipboardItems(options?: UseClipboardItemsOptions<undefined>): UseClipboardItemsReturn<false>
export function useClipboardItems(options: UseClipboardItemsOptions<MaybeRefOrGetter<ClipboardItems>>): UseClipboardItemsReturn<true>
export function useClipboardItems(options: UseClipboardItemsOptions<MaybeRefOrGetter<ClipboardItems> | undefined> = {}): UseClipboardItemsReturn<boolean> {
  const {
    navigator = defaultNavigator,
    read = false,
    source,
    copiedDuring = 1500,
  } = options

  const isSupported = useSupported(() => (navigator && 'clipboard' in navigator))
  const content = ref<ClipboardItems>([])
  const copied = ref(false)
  const timeout = useTimeoutFn(() => copied.value = false, copiedDuring)

  function updateContent() {
    if (isSupported.value) {
      navigator!.clipboard.read().then((items) => {
        content.value = items
      })
    }
  }

  if (isSupported.value && read)
    useEventListener(['copy', 'cut'], updateContent)

  async function copy(value = toValue(source)) {
    if (isSupported.value && value != null) {
      await navigator!.clipboard.write(value)

      content.value = value
      copied.value = true
      timeout.start()
    }
  }

  return {
    isSupported,
    content: content as ComputedRef<ClipboardItems>,
    copied: copied as ComputedRef<boolean>,
    copy,
  }
}
