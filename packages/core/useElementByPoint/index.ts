import type { ConfigurableScheduler, DEPRECATE_SCHEDULER_INTERVAL, Pausable } from '@vueuse/shared'
import type { ComputedRef, MaybeRefOrGetter, ShallowRef } from 'vue'
import type { ConfigurableDocument } from '../_configurable'
import { useIntervalFn } from '@vueuse/shared'
import { shallowRef, toValue } from 'vue'
import { defaultDocument } from '../_configurable'
import { useRafFn } from '../useRafFn'
import { useSupported } from '../useSupported'

export interface UseElementByPointOptions<Multiple extends boolean = false> extends ConfigurableDocument, ConfigurableScheduler {
  x: MaybeRefOrGetter<number>
  y: MaybeRefOrGetter<number>
  multiple?: MaybeRefOrGetter<Multiple>
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
export function useElementByPoint<M extends boolean = false>(options: UseElementByPointOptions<M>): UseElementByPointReturn<M>
/** @deprecated The option `interval: 'requestAnimationFrame'` has been deprecated. Please use the `scheduler` option with`useRafFn` instead */
export function useElementByPoint<M extends boolean = false>(options: DEPRECATE_SCHEDULER_INTERVAL<UseElementByPointOptions<M>>): UseElementByPointReturn<M>

export function useElementByPoint<M extends boolean = false>(options: UseElementByPointOptions<M> | DEPRECATE_SCHEDULER_INTERVAL<UseElementByPointOptions<M>>): UseElementByPointReturn<M> {
  const {
    x,
    y,
    document = defaultDocument,
    multiple,
    scheduler = (options.interval === undefined || options.interval === 'requestAnimationFrame') ? useRafFn : useIntervalFn,
    interval,
    immediate = true,
    immediateCallback,
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

  const controls: Pausable = scheduler(cb, {
    interval: interval as MaybeRefOrGetter<number>,
    immediate,
    immediateCallback,
  })

  return {
    isSupported,
    element,
    ...controls,
  }
}
