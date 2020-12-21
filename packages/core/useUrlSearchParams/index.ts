import { computed, Ref, ref, watch } from 'vue-demi'
import { useEventListener } from '../useEventListener'
import { ConfigurableWindow, defaultWindow } from '../_configurable'

/**
 * Reactive URLSearchParams
 *
 * @see   {@link https://vueuse.js.org/useUrlSearchParams}
 * @param mode
 * @param options
 */
export function useUrlSearchParams(
  mode: 'history'|'hash' = 'history',
  options: ConfigurableWindow = {},
): Ref<URLSearchParams> {
  const { window = defaultWindow } = options

  if (!window)
    return ref(new URLSearchParams(''))

  const hashWithoutParams = computed((): string => {
    const hash = window.location.hash || ''
    const index = hash.indexOf('?')
    return index > 0 ? hash.substring(0, index) : hash
  })

  const read = () => {
    if (mode === 'hash') {
      const hash = window.location.hash || ''
      const index = hash.indexOf('?')
      return new URLSearchParams(index ? hash.substring(index + 1) : '')
    }
    else {
      return new URLSearchParams(window.location.search || '')
    }
  }

  const write = (params: URLSearchParams) => {
    const empty = !params.keys.length
    const query = empty
      ? hashWithoutParams.value
      : (mode === 'hash')
        ? `${hashWithoutParams.value}?${params}`
        : `?${params}${hashWithoutParams.value}`

    window.history.replaceState({}, '', window.location.pathname + query)
  }

  const params = ref(read()) as Ref<URLSearchParams>

  useEventListener(window, 'popstate', () => {
    params.value = read()
  })

  watch(params, newValue => write(newValue), { deep: true })

  return params
}
