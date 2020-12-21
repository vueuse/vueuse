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
    let url
    if (mode === 'hash') {
      url = params.entries().next().done
        ? `${window.location.pathname}${hashWithoutParams.value}`
        : `${window.location.pathname}${hashWithoutParams.value}?${params}`
    }
    else {
      url = params.entries().next().done
        ? `${window.location.pathname}${hashWithoutParams.value}`
        : `${window.location.pathname}?${params}${hashWithoutParams.value}`
    }

    window.history.replaceState({}, '', url)
  }

  const params = ref(read()) as Ref<URLSearchParams>

  useEventListener(window, 'popstate', () => {
    params.value = read()
  })

  watch(params, newValue => write(newValue), { deep: true })

  return params
}
