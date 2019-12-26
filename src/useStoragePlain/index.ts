import { ref, watch } from '../api'

export function useStoragePlain (key: string, defaultValue?: string, storage: Storage = localStorage) {
  const data = ref(defaultValue)

  try {
    const rawValue = storage.getItem(key)
    if (!rawValue) {
      if (defaultValue)
        storage.setItem(key, defaultValue)
    }
    else {
      data.value = rawValue || undefined
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
          storage.removeItem(key)
        else
          storage.setItem(key, data.value)
      }
      catch (e) {
        console.warn(e)
      }
    },
    { flush: 'sync', lazy: true },
  )

  return data
}
