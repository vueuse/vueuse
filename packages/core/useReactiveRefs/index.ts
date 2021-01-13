import { Ref, Vue, getCurrentInstance, isVue2, isVue3 } from 'vue-demi'

/**
 * Use reactive $refs in Vue 2,3
 *
 * @see   {@link https://vueuse.js.org/core/useReactiveRefs}
 * @param refs
 */
export const useReactiveRefs = (refs: Record<string, Ref<Element | Element[] | typeof Vue | typeof Vue[] | undefined | null>>) => {
  const instance = getCurrentInstance()
  if (!instance) return

  const value = Object.keys(refs).reduce((map, key) => {
    Object.defineProperty(map, key, {
      set: val => refs[key] && (refs[key].value = val),
      get: () => refs[key]?.value,
    })
    return map
  }, {})

  if (isVue3)
    Object.defineProperty(instance, 'refs', { value })

  if (isVue2 && instance.proxy)
    Object.defineProperty(instance.proxy, '$refs', { value })
}
