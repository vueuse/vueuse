import type { MaybeElementRef } from '@vueuse/core'
import { unrefElement, useEventListener } from '@vueuse/core'
import { computed, ref } from 'vue-demi'

const DEFAULT_DELAY = 500

export interface LongpressOptions{
  /**
   * Time in ms till `longpress` gets called
   *
   * @default 500
   */
  delay?: number
}

export function onLongpress(target: MaybeElementRef, handler: (evt: PointerEvent) => void, options?: LongpressOptions) {
  const elementRef = computed(() => unrefElement(target))

  const timeout = ref<number|null>(null)

  const onDown = (ev: PointerEvent) => {
    timeout.value = setTimeout(() => {
      handler(ev)
    }, options?.delay ?? DEFAULT_DELAY) as unknown as number
  }

  const onUp = () => {
    if (timeout.value !== null) {
      clearTimeout(timeout.value)
      timeout.value = null
    }
  }

  useEventListener(elementRef, 'pointerdown', onDown)
  useEventListener(elementRef, 'pointerup', onUp)
  useEventListener(elementRef, 'pointermove', onUp)
}
