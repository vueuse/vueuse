import { isString, resolveUnref, useDebounceFn } from '@vueuse/shared'
import type { MaybeComputedRef } from '@vueuse/shared'
import type { Ref } from 'vue-demi'
import { shallowRef, watch } from 'vue-demi'

interface UseSearchReturn<T = any> {
  /**
   * search result
   */
  data: Ref<T[]>
  /**
   * functions to search a list
   * @param {string} keyword
   */
  search: (keyword: string) => void
}

interface UseSearchOptions<T> {
  /**
   * list of searchable fields
   */
  field?: Array<keyof T> | keyof T

  /**
   * Perform the search immediately after calling the function
   * @default true
   */
  immediate?: boolean

  /**
   * delay time search
   * @default 0
   */
  delay?: number

  /**
   * custom filter function
   * @param item
   * @param {string} keyword
   * @return {boolean}
   */
  filter?: (item: T, keyword: string) => boolean
}

export function useSearch<T extends object>(list: MaybeComputedRef<T[]>, keyword: Ref<string>, options: UseSearchOptions<T> & Required<Pick<UseSearchOptions<T>, 'filter'>>): UseSearchReturn<T>
export function useSearch<T extends object>(list: MaybeComputedRef<T[]>, keyword: Ref<string>, options: UseSearchOptions<T> & Required<Pick<UseSearchOptions<T>, 'field'>>): UseSearchReturn<T>
export function useSearch<T extends string>(list: MaybeComputedRef<T[]>, keyword: Ref<string>, options?: UseSearchOptions<T>): UseSearchReturn<T>
/**
 * Reactive search list data
 * @see https://vueuse.org/useSearch
 * @param list
 * @param {string} keyword - search keyword
 * @param options
 */
export function useSearch<T = any>(list: MaybeComputedRef<T[]>, keyword: Ref<string>, options: UseSearchOptions<T> = {}): UseSearchReturn<T> {
  const data = shallowRef(resolveUnref(list)) as Ref<T[]>
  const { field = [], immediate = true, delay = 0, filter } = options

  const search = useDebounceFn((text: string = resolveUnref(keyword)) => {
    if (filter)
      return data.value = resolveUnref(list).filter(item => filter(item, text))

    text = text.trim()
    if (text === '')
      return data.value = resolveUnref(list)
    const reg = new RegExp(text, 'i')
    return data.value = resolveUnref(list).filter(item =>
      isString(item) ? reg.test(item) : (Array.isArray(field) ? field : [field]).some(key => reg.test(item[key] as string)),
    )
  }, delay)

  watch(keyword, () => search(), { flush: 'sync', immediate })

  return { data, search }
}
