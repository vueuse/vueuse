import type { ComputedRef, MaybeRefOrGetter } from 'vue'
import type { ConfigurableWindow } from '../_configurable'
import { computed, toValue } from 'vue'
import { defaultWindow } from '../_configurable'
import { useMounted } from '../useMounted'

export interface UseCssSupportsOptions extends ConfigurableWindow {

}

export interface UseCssSupportsReturn {
  isSupported: ComputedRef<boolean>
}

export function useCssSupports(property: MaybeRefOrGetter<string>, value: MaybeRefOrGetter<string>, options?: UseCssSupportsOptions): UseCssSupportsReturn
export function useCssSupports(conditionText: MaybeRefOrGetter<string>, options?: UseCssSupportsOptions): UseCssSupportsReturn
export function useCssSupports(...args: any[]): UseCssSupportsReturn {
  let options: UseCssSupportsOptions = {}

  if (typeof toValue(args.at(-1)) === 'object') {
    options = args.pop()
  }

  const [prop, value] = args

  const { window = defaultWindow } = options

  const isMounted = useMounted()

  return {
    isSupported: computed(() => {
      // to trigger the ref
      // eslint-disable-next-line ts/no-unused-expressions
      isMounted.value
      return Boolean(toValue(value)
        // @ts-expect-error window type is not correct
        ? window?.CSS.supports(toValue(prop), toValue(value))
        // @ts-expect-error window type is not correct
        : window?.CSS.supports(toValue(prop)))
    }),
  }
}
