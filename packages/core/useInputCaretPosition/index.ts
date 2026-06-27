import type { MaybeElementRef } from '../unrefElement'
import type { UseInputSelectionOptions } from '../useInputSelection'
import { computed } from 'vue'
import { useInputSelection } from '../useInputSelection'

export interface UseInputCaretPostionOptions extends UseInputSelectionOptions {

}

export function useInputCaretPosition<T extends (HTMLInputElement | HTMLTextAreaElement)>(target: MaybeElementRef<T | null | undefined>, options: UseInputCaretPostionOptions = {}) {
  const { start, end, direction } = useInputSelection<T>(target, options)

  const position = computed<T['selectionStart'] | T['selectionEnd']>({
    set(value) {
      start.value = value
      end.value = value
    },
    get() {
      if (direction.value === 'backward') {
        return start.value
      }
      return end.value
    },
  })

  return {
    position,
  }
}

export type UseInputCaretPositionReturn = ReturnType<typeof useInputCaretPosition>
