import { ref } from 'vue-demi'
import type { MaybeRefOrGetter } from '@vueuse/shared'
import { toValue } from '@vueuse/shared'
import { useRafFn } from '../useRafFn'
import type { ConfigurableDocument } from '../_configurable'
import { defaultDocument } from '../_configurable'

export interface UseElementByPointOptions extends ConfigurableDocument {
  x: MaybeRefOrGetter<number>
  y: MaybeRefOrGetter<number>
}

/**
 * Reactive element by point.
 *
 * @see https://vueuse.org/useElementByPoint
 * @param options - UseElementByPointOptions
 */
export function useElementByPoint(options: UseElementByPointOptions) {
  const element = ref<HTMLElement | null>(null)

  const { x, y, document = defaultDocument } = options

  const controls = useRafFn(() => {
    element.value = (document?.elementFromPoint(toValue(x), toValue(y)) || null) as HTMLElement | null
  })

  return {
    element,
    ...controls,
  }
}

export type UseElementByPointReturn = ReturnType<typeof useElementByPoint>
