import { computed, reactive, Ref, ref, watch } from 'vue-demi'
import { useEventListener } from '../useEventListener'
import { ConfigurableWindow, defaultWindow } from '../_configurable'

export type UrlParams = {[key: string]: string[] | string}

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
) {
  const { window = defaultWindow } = options

  if (!window)
    return {}

  const hashWithoutParams = computed((): string => {
    const hash = window.location.hash || ''
    const index = hash.indexOf('?')
    return index > 0 ? hash.substring(0, index) : hash
  })

  const read = (): URLSearchParams => {
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
  const paramsMap: UrlParams = reactive<UrlParams>({})

  const updateParamsMap = () => {
    Object.keys(paramsMap).forEach(key => delete paramsMap[key])
    for (const key of params.value.keys()) {
      const paramsForKey = params.value.getAll(key)
      paramsMap[key] = paramsForKey.length > 1 ? paramsForKey : (params.value.get(key) || '')
    }
  }

  useEventListener(window, 'popstate', () => {
    params.value = read()
    updateParamsMap()
    write(params.value)
  })

  watch(paramsMap, () => {
    params.value = new URLSearchParams('')
    Object.keys(paramsMap).forEach((key) => {
      const mapEntry = paramsMap[key]
      if (Array.isArray(mapEntry))
        mapEntry.forEach(value => params.value.append(key, value))
      else
        params.value.set(key, mapEntry)
    })
    write(params.value)
  }, { deep: true })

  return paramsMap
}
