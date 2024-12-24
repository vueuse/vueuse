import type { MaybeRefOrGetter } from 'vue'
import type { MaybeComputedElementRef } from '../unrefElement'
import { computedWithControl, toValue } from '@vueuse/shared'
import { computed } from 'vue'
import { unrefElement } from '../unrefElement'
import { useEventListener } from '../useEventListener'

export interface UseCaretPositionOptions {
  /**
   * Wheather to auto focus the input on position set or not
   *
   * @default true
   */
  autoFocus?: MaybeRefOrGetter<boolean>
}

export function useCaretPosition(target: MaybeComputedElementRef<HTMLInputElement>, options: UseCaretPositionOptions = {}) {
  const {
    autoFocus = true,
  } = options

  const pos = computedWithControl(() => {}, () => {
    const el = unrefElement(target)
    if (el?.selectionDirection === 'backward') {
      return el?.selectionStart
    }
    return el?.selectionEnd
  })

  const position = computed<HTMLInputElement['selectionStart']>({
    set(value) {
      const el = unrefElement(target)
      if (!el?.matches(':focus') && !toValue(autoFocus)) {
        return
      }
      el?.focus()
      el?.setSelectionRange(value, value)
      pos.trigger()
    },
    get() {
      return pos.value ?? null
    },
  })

  useEventListener(target, ['input', 'click', 'keyup', 'mouseup', 'mousedown', 'focus', 'blur', 'keydown'], () => pos.trigger(), { passive: true })

  return {
    position,
  }
}
