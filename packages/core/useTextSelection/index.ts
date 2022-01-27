import { computed, ref } from 'vue-demi'
import { useEventListener } from '../useEventListener'

function getRangesFromSelection(selection: Selection) {
  const rangeCount = selection.rangeCount ?? 0
  const ranges = new Array(rangeCount)
  for (let i = 0; i < rangeCount; i++) {
    const range = selection.getRangeAt(i)
    ranges[i] = range
  }
  return ranges
}

/**
 * Reactively track user text selection based on [`Window.getSelection`](https://developer.mozilla.org/en-US/docs/Web/API/Window/getSelection).
 *
 * @see https://vueuse.org/useTextSelection
 */
export function useTextSelection() {
  const selection = ref<Selection | null>(null)
  const text = computed(() => selection.value?.toString() ?? '')
  const ranges = computed<Range[]>(() => selection.value ? getRangesFromSelection(selection.value) : [])
  const rects = computed(() => ranges.value.map(range => range.getBoundingClientRect()))

  function onSelectionChange() {
    selection.value = null // trigger computed update
    selection.value = window.getSelection()
  }

  useEventListener(document, 'selectionchange', onSelectionChange)
  return {
    text,
    rects,
    ranges,
    selection,
  }
}

export type UseTextSelectionReturn = ReturnType<typeof useTextSelection>
