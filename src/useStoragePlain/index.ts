import { ref, watch } from '../api'
import { useEventListener } from '../useEventListener'

export function useStoragePlain (key: string, defaultValue?: string, storage: Storage = localStorage) {
  const data = ref(defaultValue)

  function read () {
    try {
      let rawValue = storage.getItem(key)
      if (!rawValue && defaultValue) {
        storage.setItem(key, defaultValue)
        rawValue = defaultValue
      }
      else {
        data.value = rawValue || undefined
      }
    }
    catch (e) {
      console.warn(e)
    }
  }

  read()

  useEventListener('storage', read)

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
