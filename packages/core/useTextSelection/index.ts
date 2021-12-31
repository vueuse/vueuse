import type { MaybeRef } from '@vueuse/shared'
import { ref } from 'vue-demi'
import { useEventListener } from '../useEventListener'
import { defaultWindow } from '../_configurable'

type Rect = Omit<DOMRectReadOnly, 'x'|'y'|'toJSON'>

export interface UseTextSelectionState extends Rect {
  text: string
}

const initialRect: Rect = {
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  height: 0,
  width: 0,
}

const initialState: UseTextSelectionState = {
  text: '',
  ...initialRect,
}

function getRectFromSelection(selection: Selection | null): Rect {
  if (!selection || selection.rangeCount < 1)
    return initialRect

  const range = selection.getRangeAt(0)
  const { height, width, top, left, right, bottom } = range.getBoundingClientRect()
  return {
    height,
    width,
    top,
    left,
    right,
    bottom,
  }
}

export function useTextSelection(
  element?: MaybeRef<HTMLElement | Document | null | undefined>,
) {
  const state = ref(initialState)

  if (!defaultWindow?.getSelection) return state

  const onMouseup = () => {
    const text = window.getSelection()?.toString()
    if (text) {
      const rect = getRectFromSelection(window.getSelection())
      state.value = {
        ...state.value,
        ...rect,
        text,
      }
    }
  }
  const onMousedown = () => {
    state.value.text && (state.value = initialState)
    window.getSelection()?.removeAllRanges()
  }
  useEventListener(element ?? document, 'mouseup', onMouseup)
  useEventListener(document, 'mousedown', onMousedown)

  return state
}

export type UseTextSelectionReturn = ReturnType<typeof useTextSelection>
