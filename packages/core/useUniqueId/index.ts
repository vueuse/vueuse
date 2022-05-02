import type { MaybeRef } from '@vueuse/shared'
import type { WatchOptions } from 'vue-demi'
import { computed, isRef, ref } from 'vue-demi'

const uniqueId = new Map<string | symbol, number>()
const normalPrefix = Symbol('normalPrefix')

/**
 * Generate globally unique ID
 *
 * @see https://vueuse.org/useUniqueId
 * @param prefix string
 * @param options
 */
export function useUniqueId(prefix?: MaybeRef<string>, options: WatchOptions = {}) {
  function parseId(str: string | typeof normalPrefix) {
    const existPrefix = uniqueId.has(str)
    if (!existPrefix) {
      uniqueId.set(str, 1)

      return str === normalPrefix ? '$$unique_1' : `${str}1`
    }

    let id = uniqueId.get(str)!
    uniqueId.set(str, ++id)

    return str === normalPrefix ? `$$unique_${id}` : `${str}${id}`
  }

  if (!prefix)
    return ref(parseId(normalPrefix))

  if (!isRef(prefix))
    return ref(parseId(prefix))

  return computed(() => {
    const p = prefix.value

    return parseId(p)
  }, options)
}
