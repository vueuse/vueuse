import { readonly, ref, watch } from 'vue-demi'
import { useEventListener } from '../useEventListener'

/**
 * Reactive Location Hash
 *
 * @see https://vueuse.org/useHash
 */
export const useHash = () => {
  const hash = ref(window ? window.location.hash : '')

  const setHash = (value: string) => {
    hash.value = value
  }

  watch(
    hash,
    () => {
      if (window && window.location.hash !== hash.value)
        window.location.hash = hash.value
    },
  )

  const onHashChange = () => {
    setHash(window.location.hash)
  }

  useEventListener(window, 'hashchange', onHashChange, false)

  return {
    hash: readonly(hash),
    setHash,
  }
}
