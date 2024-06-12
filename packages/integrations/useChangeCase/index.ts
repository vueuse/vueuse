import type { Options } from 'change-case'
import type { MaybeRef, MaybeRefOrGetter } from '@vueuse/shared'
import { toValue } from '@vueuse/shared'
import type { ComputedRef, WritableComputedRef } from 'vue-demi'
import { computed, ref } from 'vue-demi'
import * as changeCase from 'change-case'

type EndsWithCase<T> = T extends `${infer _}Case` ? T : never
type FilterKeys<T> = { [K in keyof T as K extends string ? K : never]: EndsWithCase<K> }
type ChangeCaseKeys = FilterKeys<typeof changeCase>

export type ChangeCaseType = ChangeCaseKeys[keyof ChangeCaseKeys]

const changeCaseTransforms: any = /* @__PURE__ */ Object.values(changeCase)
  .filter(v => typeof v === 'function' && v.name.endsWith('Case')).reduce((acc, fn) => {
    acc[fn.name] = fn
    return acc
  }, {} as any)

export function useChangeCase(input: MaybeRef<string>, type: MaybeRefOrGetter<ChangeCaseType>, options?: MaybeRefOrGetter<Options> | undefined): WritableComputedRef<string>
export function useChangeCase(input: MaybeRefOrGetter<string>, type: MaybeRefOrGetter<ChangeCaseType>, options?: MaybeRefOrGetter<Options> | undefined): ComputedRef<string>

/**
 * Reactive wrapper for `change-case`
 *
 * @see https://vueuse.org/useChangeCase
 */
export function useChangeCase(input: MaybeRefOrGetter<string>, type: MaybeRefOrGetter<ChangeCaseType>, options?: MaybeRefOrGetter<Options> | undefined) {
  const typeRef = computed(() => {
    const t = toValue(type)
    if (!changeCaseTransforms[t])
      throw new Error(`Invalid change case type "${t}"`)
    return t
  })

  if (typeof input === 'function')
    return computed(() => changeCaseTransforms[typeRef.value](toValue(input), toValue(options)))

  const text = ref(input)
  return computed<string>({
    get() {
      return changeCaseTransforms[typeRef.value](text.value, toValue(options))
    },
    set(value) {
      text.value = value
    },
  })
}
