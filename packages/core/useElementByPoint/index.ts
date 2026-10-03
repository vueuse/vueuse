import type { Pausable } from '@vueuse/shared'
import type { MaybeRefOrGetter, ShallowRef } from 'vue'
import type { ConfigurableDocument, ConfigurableScheduler } from '../_configurable'
import type { Supportable } from '../types'
import { shallowRef, toValue } from 'vue'
import { defaultDocument } from '../_configurable'
import { useRafFn } from '../useRafFn'
import { useSupported } from '../useSupported'

export interface UseElementByPointOptions<Multiple extends boolean = false> extends ConfigurableDocument, ConfigurableScheduler {
  x: MaybeRefOrGetter<number>
  y: MaybeRefOrGetter<number>
  multiple?: MaybeRefOrGetter<Multiple>
}

export interface UseElementByPointReturn<Multiple extends boolean = false> extends Supportable, Pausable {
  element: ShallowRef<Multiple extends true ? HTMLElement[] : HTMLElement | null>
}

/**
 * Reactive element by point.
 *
 * @see https://vueuse.org/useElementByPoint
 * @param options - UseElementByPointOptions
 */
export function useElementByPoint<M extends boolean = false>(options: UseElementByPointOptions<M>): UseElementByPointReturn<M> {
  const {
    x,
    y,
    document = defaultDocument,
    multiple,
    scheduler = useRafFn,
  } = options

  const isSupported = useSupported(() => {
    if (toValue(multiple))
      return document && 'elementsFromPoint' in document

    return document && 'elementFromPoint' in document
  })

  const element = shallowRef<any>(null)

  const controls = scheduler(() => {
    element.value = toValue(multiple)
      ? document?.elementsFromPoint(toValue(x), toValue(y)) ?? []
      : document?.elementFromPoint(toValue(x), toValue(y)) ?? null
  })

  return {
    isSupported,
    element,
    ...controls,
  }
}
