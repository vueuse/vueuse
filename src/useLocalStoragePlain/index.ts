import { ref, watch } from '../api'

export function useLocalStoragePlain (key: string, defaultValue?: string) {
  const data = ref(defaultValue)

  try {
    const localStorageValue = localStorage.getItem(key)
    if (!localStorageValue) {
      if (defaultValue)
        localStorage.setItem(key, defaultValue)
    }
    else {
      data.value = localStorageValue || undefined
    }
  }
  catch (e) {
    console.warn(e)
  }

  watch(
    data,
    () => {
      try {
        if (data.value == null)
          localStorage.removeItem(key)
        else
          localStorage.setItem(key, data.value)
      }
      catch (e) {
        console.warn(e)
      }
    },
    { flush: 'sync', lazy: true },
  )

  return data
}
