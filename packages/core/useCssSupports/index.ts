import type { MaybeRefOrGetter } from 'vue'
import type { ConfigurableWindow } from '../_configurable'
import { computed, toValue } from 'vue'
import { defaultWindow } from '../_configurable'
import { useMounted } from '../useMounted'

export interface UseCssSupportsOptions extends ConfigurableWindow {

}

export function useCssSupports(prop: MaybeRefOrGetter<string>, value?: MaybeRefOrGetter<string>, options: UseCssSupportsOptions = {}) {
  const { window = defaultWindow } = options

  const isMounted = useMounted()

  return {
    isSupported: computed(() => {
      // to trigger the ref
      // eslint-disable-next-line ts/no-unused-expressions
      isMounted.value
      // @ts-expect-error window type is not correct
      return toValue(value) ? window?.CSS.supports(toValue(prop), toValue(value)) : window?.CSS.supports(toValue(prop))
    }),
  }
}
