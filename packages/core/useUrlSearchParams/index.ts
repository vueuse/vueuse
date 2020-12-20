import { computed, ref, watch } from 'vue-demi'
import { useBrowserLocation } from '..'
import { useEventListener } from '../useEventListener'

export function useUrlSearchParams(method: 'history'|'hash') {
  const location = useBrowserLocation()

  const hashWithoutParams = computed((): string => {
    const hash = location.value.hash || ''
    const paramsIndex = hash.indexOf('?')
    return paramsIndex > 0 ? hash.substring(0, paramsIndex) : hash
  })

  const readParams = (): URLSearchParams => {
    if (method === 'hash') {
      const hash = location.value.hash || ''
      const iParams = hash.indexOf('?')
      return iParams ? new URLSearchParams(hash.substring(iParams + 1)) : new URLSearchParams('')
    }
    else {
      return new URLSearchParams(location.value.search || '')
    }
  }

  const writeParams = (params: URLSearchParams) => {
    if (method === 'hash') {
      params.entries().next().done
        ? window.history.replaceState({}, '', `${location.value.pathname}${hashWithoutParams.value}`)
        : window.history.replaceState({}, '', `${location.value.pathname}${hashWithoutParams.value}?${params}`)
    }
    else {
      params.entries().next().done
        ? window.history.replaceState({}, '', `${location.value.pathname}${hashWithoutParams.value}`)
        : window.history.replaceState({}, '', `${location.value.pathname}?${params}${hashWithoutParams.value}`)
    }
  }

  const params = ref<URLSearchParams>(readParams())

  useEventListener(window, 'popstate', () => {
    params.value = readParams()
  })

  watch(params, (newValue: URLSearchParams) => writeParams(newValue))

  return params
}
