import type { UnwrapRef } from 'vue-demi'
import { computed, ref, watch } from 'vue-demi'
import { reactivePick, toReactive } from '../index'

/**
 * Reactively omit fields from a reactive object
 *
 * @see https://vueuse.js.org/reactiveOmit
 */
export function reactiveOmit<T extends object, K extends keyof T>(
  obj: T,
  ...keys: K[]
): { [S in Exclude<keyof T, K>]: UnwrapRef<T[S]> } {
  const v = ref({} as { [S in Exclude<keyof T, K>]: UnwrapRef<T[S]> })
  const k = computed(() => Object.keys(obj).filter(k => !keys.includes(k as any)) as Array<Exclude<keyof T, K>>)

  watch(k, () => {
    v.value = reactivePick(obj, ...k.value)
  }, { immediate: true })

  return toReactive(v)
}
