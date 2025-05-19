import type { Pausable } from '@vueuse/shared'
import type { ComputedRef, MaybeRefOrGetter, ShallowRef } from 'vue'
import type { ConfigurableDocument } from '../_configurable'
import { useIntervalFn } from '@vueuse/shared'
import { shallowRef, toValue } from 'vue'
import { defaultDocument } from '../_configurable'
import { useRafFn } from '../useRafFn'
import { useSupported } from '../useSupported'

export interface UseElementByPointOptions<Multiple extends boolean = false> extends ConfigurableDocument {
  x: MaybeRefOrGetter<number>
  y: MaybeRefOrGetter<number>
  multiple?: MaybeRefOrGetter<Multiple>
  immediate?: boolean
  interval?: 'requestAnimationFrame' | number
}

export interface UseElementByPointReturn<Multiple extends boolean = false> extends Pausable {
  isSupported: ComputedRef<boolean>
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
    interval = 'requestAnimationFrame',
    immediate = true,
  } = options

  const isSupported = useSupported(() => {
    if (toValue(multiple))
      return document && 'elementsFromPoint' in document

    return document && 'elementFromPoint' in document
  })

  const element = shallowRef<any>(null)

  const cb = () => {
    element.value = toValue(multiple)
      ? document?.elementsFromPoint(toValue(x), toValue(y)) ?? []
      : document?.elementFromPoint(toValue(x), toValue(y)) ?? null
  }

  const controls: Pausable = interval === 'requestAnimationFrame'
    ? useRafFn(cb, { immediate })
    : useIntervalFn(cb, interval, { immediate })

  return {
    isSupported,
    element,
    ...controls,
  }
}
