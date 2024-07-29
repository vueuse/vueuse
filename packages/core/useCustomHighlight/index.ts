import { computed, ref, toValue, watch } from 'vue-demi'
import { type MaybeRefOrGetter, notNullish } from '@vueuse/shared'
import { type MaybeComputedElementRef, type MaybeElement, unrefElement } from '../unrefElement'
import { useMutationObserver } from '../useMutationObserver'
import { useSupported } from '../useSupported'

export interface UseCustomHighlightOptions {
  /**
   * Matches the name of the `::highlight()` selector.
   */
  name: string
  /**
   * Watches DOM changes via `MutationObserver`.
   *
   * @default false
   */
  watch?: boolean
}

/**
 * Reactive CSS Custom Highlight API.
 *
 * @see https://vueuse.org/useCustomHighlight
 */
export function useCustomHighlight(
  target: MaybeComputedElementRef | MaybeComputedElementRef[] | MaybeRefOrGetter<MaybeElement[]>,
  word: MaybeRefOrGetter<string | RegExp>,
  options: UseCustomHighlightOptions,
) {
  const isSupported = useSupported(() => CSS && 'highlights' in CSS)

  const targets = computed(() => {
    const _target = toValue(target)
    return (Array.isArray(_target) ? _target : [_target]).map(unrefElement).filter(notNullish)
  })

  const textNodes = ref<Node[]>([])

  const ranges = computed(() => {
    const rule = toValue(word)
    const { length } = rule.toString()
    if (!length) {
      return []
    }

    let text = ''
    const points = [0]
    for (const node of textNodes.value) {
      text += node.textContent
      points.push(text.length)
    }

    const indices = findWordIndices(text, rule)

    function findNodeAndOffset(wordIdx: number): [Node, number] {
      const nodeIdx = points.findIndex(p => p > wordIdx) - 1
      const node = textNodes.value[nodeIdx]
      const offset = wordIdx - points[nodeIdx]
      return [node, offset]
    }

    return indices.map(([start, end]) => {
      const [startNode, startOffset] = findNodeAndOffset(start)
      const [endNode, endOffset] = findNodeAndOffset(end)

      const range = new Range()
      range.setStart(startNode, startOffset)
      range.setEnd(endNode, endOffset)
      return range
    })
  })

  function update() {
    textNodes.value = []

    for (const target of targets.value) {
      const treeWalker = document.createTreeWalker(target, NodeFilter.SHOW_TEXT)
      let currentNode = treeWalker.nextNode()
      while (currentNode) {
        textNodes.value.push(currentNode)
        currentNode = treeWalker.nextNode()
      }
    }
  }

  if (isSupported.value) {
    watch(targets, update, {
      immediate: true,
    })

    if (options.watch) {
      useMutationObserver(targets, update, {
        characterData: true,
        childList: true,
        subtree: true,
      })
    }

    const highlight = CSS.highlights.get(options.name) ?? new Highlight()
    CSS.highlights.set(options.name, highlight)

    watch(ranges, (newVal, oldVal = []) => {
      for (const range of oldVal) {
        highlight.delete(range)
      }
      for (const range of newVal) {
        highlight.add(range)
      }
    })
  }

  return {
    isSupported,
    update,
  }
}

export type UseCustomHighlightReturn = ReturnType<typeof useCustomHighlight>

function findWordIndices(text: string, rule: string | RegExp) {
  const indices: [number, number][] = []

  if (typeof rule === 'string') {
    for (let offset = 0; offset < text.length;) {
      const idx = text.indexOf(rule, offset)
      if (idx !== -1) {
        offset = idx + rule.length
        indices.push([idx, offset])
      }
      else {
        break
      }
    }
  }
  else {
    const matches = text.matchAll(rule)
    for (const match of matches) {
      const { 0: res, index } = match
      indices.push([index, index + res.length])
    }
  }
  return indices
}
