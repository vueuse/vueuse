import { type MaybeRefOrGetter, type UnwrapRef, type WatchSource, isRef, ref, toValue, watch } from 'vue-demi'
import type { ConfigurableFlushSync } from '../utils'

export interface RefBindOptions extends ConfigurableFlushSync {
  deep?: boolean
}

/**
 * Creates a new ref that is bound to a reactive source. The ref will be updated whenever the source changes.
 * @template T The type of the reactive source.
 * @param {Ref<T> | ComputedGetter<T>} value The reactive source to bind the ref to.
 * @param {WatchSource} [triggerSource] The source to trigger the update of the ref. Defaults to the reactive source.
 * @returns {Ref<T>} The bound ref.
 */
export function refBind<T>(value: MaybeRefOrGetter<T>, triggerSource?: WatchSource, options: RefBindOptions = {}) {
  const {
    flush = 'sync',
    deep = false,
  } = options

  const refValue = ref<T>(toValue(value))
  const source = triggerSource ?? ((isRef(value) || typeof value === 'function') ? value : null)

  if (source) {
    watch(source, () => {
      refValue.value = (toValue(value) as UnwrapRef<T>)
    }, { flush, deep })
  }

  return refValue
}
