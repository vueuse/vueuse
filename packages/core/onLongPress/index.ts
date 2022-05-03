import { computed } from 'vue-demi'
import type { MaybeElementRef } from '../unrefElement'
import { unrefElement } from '../unrefElement'
import { useEventListener } from '../useEventListener'

const DEFAULT_DELAY = 500

export interface OnLongPressOptions {
  /**
   * Time in ms till `longpress` gets called
   *
   * @default 500
   */
  delay?: number
}

export function onLongPress(
  target: MaybeElementRef,
  handler: (evt: PointerEvent) => void,
  options?: OnLongPressOptions,
) {
  const elementRef = computed(() => unrefElement(target))

  let timeout: number | null = null

  function clear() {
    if (timeout != null) {
      clearTimeout(timeout)
      timeout = null
    }
  }

  function onDown(ev: PointerEvent) {
    clear()
    timeout = setTimeout(
      () => handler(ev),
      options?.delay ?? DEFAULT_DELAY,
    ) as unknown as number
  }

  useEventListener(elementRef, 'pointerdown', onDown)
  useEventListener(elementRef, 'pointerup', clear)
  useEventListener(elementRef, 'pointerleave', clear)
}
