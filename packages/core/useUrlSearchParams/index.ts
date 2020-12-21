import { computed, Ref, ref, watch } from 'vue-demi'
import { useEventListener } from '../useEventListener'

export function useUrlSearchParams(method: 'history'|'hash'): Ref<URLSearchParams> {
  const hashWithoutParams = computed((): string => {
    const hash = window.location.hash || ''
    const paramsIndex = hash.indexOf('?')
    return paramsIndex > 0 ? hash.substring(0, paramsIndex) : hash
  })

  const readParams = (): URLSearchParams => {
    if (method === 'hash') {
      const hash = window.location.hash || ''
      const iParams = hash.indexOf('?')
      return iParams ? new URLSearchParams(hash.substring(iParams + 1)) : new URLSearchParams('')
    }
    else {
      return new URLSearchParams(window.location.search || '')
    }
  }

  const writeParams = (params: URLSearchParams) => {
    if (method === 'hash') {
      params.entries().next().done
        ? window.history.replaceState({}, '', `${window.location.pathname}${hashWithoutParams.value}`)
        : window.history.replaceState({}, '', `${window.location.pathname}${hashWithoutParams.value}?${params}`)
    }
    else {
      params.entries().next().done
        ? window.history.replaceState({}, '', `${window.location.pathname}${hashWithoutParams.value}`)
        : window.history.replaceState({}, '', `${window.location.pathname}?${params}${hashWithoutParams.value}`)
    }
  }

  const params = ref<URLSearchParams>(readParams())

  useEventListener(window, 'popstate', () => {
    params.value = readParams()
  })

  watch(params, (newValue: URLSearchParams) => writeParams(newValue))

  return params
}
