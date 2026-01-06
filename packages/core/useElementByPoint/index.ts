import type { AnyFn, Pausable } from '@vueuse/shared'
import type { ComputedRef, MaybeRefOrGetter, ShallowRef } from 'vue'
import type { ConfigurableDocument, ConfigurableScheduler } from '../_configurable'
import { useIntervalFn } from '@vueuse/shared'
import { shallowRef, toValue } from 'vue'
import { defaultDocument } from '../_configurable'
import { useRafFn } from '../useRafFn'
import { useSupported } from '../useSupported'

function getDefaultScheduler(options: UseElementByPointOptions<boolean>) {
  if ('interval' in options || 'immediate' in options) {
    const {
      interval = 'requestAnimationFrame',
      immediate = true,
    } = options

    return interval === 'requestAnimationFrame'
      ? (cb: AnyFn) => useRafFn(cb, { immediate })
      : (cb: AnyFn) => useIntervalFn(cb, interval, { immediate })
  }

  return useRafFn
}

export interface UseElementByPointOptions<Multiple extends boolean = false> extends ConfigurableDocument, ConfigurableScheduler {
  x: MaybeRefOrGetter<number>
  y: MaybeRefOrGetter<number>
  multiple?: MaybeRefOrGetter<Multiple>
  /** @deprecated Please use `scheduler` option instead */
  immediate?: boolean
  /** @deprecated Please use `scheduler` option instead */
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
    scheduler = getDefaultScheduler(options),
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
