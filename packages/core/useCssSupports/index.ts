import type { MaybeRefOrGetter } from 'vue'
import type { ConfigurableWindow } from '../_configurable'
import type { Supportable } from '../types'
import { isClient } from '@vueuse/shared'
import { computed, toValue } from 'vue'
import { defaultWindow } from '../_configurable'
import { useMounted } from '../useMounted'

export interface UseCssSupportsOptions extends ConfigurableWindow {
  ssrValue?: boolean
}

export interface UseCssSupportsReturn extends Supportable {
}

export function useCssSupports(property: MaybeRefOrGetter<string>, value: MaybeRefOrGetter<string>, options?: UseCssSupportsOptions): UseCssSupportsReturn
export function useCssSupports(conditionText: MaybeRefOrGetter<string>, options?: UseCssSupportsOptions): UseCssSupportsReturn
export function useCssSupports(...args: any[]): UseCssSupportsReturn {
  let options: UseCssSupportsOptions = {}

  if (typeof toValue(args.at(-1)) === 'object') {
    options = args.pop()
  }

  const [prop, value] = args

  const { window = defaultWindow, ssrValue = false } = options

  const isMounted = useMounted()

  return {
    isSupported: computed(() => {
      if (!isClient || !isMounted.value) {
        return ssrValue
      }

      return args.length === 2
        // @ts-expect-error window type is not correct
        ? window?.CSS.supports(toValue(prop), toValue(value))
        // @ts-expect-error window type is not correct
        : window?.CSS.supports(toValue(prop))
    }),
  }
}
