import { ref, watch, Ref } from '../../api'
import { useEventListener } from '../useEventListener'

export function useStoragePlain (key: string, defaultValue: string, storage?: Storage): Ref<string>
export function useStoragePlain (key: string, defaultValue: boolean, storage?: Storage): Ref<boolean>
export function useStoragePlain (key: string, defaultValue: number, storage?: Storage): Ref<number>
export function useStoragePlain (key: string, defaultValue: null, storage?: Storage): Ref<any>
export function useStoragePlain<T extends (string|number|boolean|null)> (key: string, defaultValue: T, storage: Storage = localStorage) {
  const data = ref<T>(defaultValue)

  function read () {
    try {
      let rawValue = storage.getItem(key)
      if (rawValue === undefined && defaultValue) {
        rawValue = String(defaultValue)
        storage.setItem(key, rawValue)
      }
      else {
        if (defaultValue == null)
          data.value = rawValue as any
        else if (typeof defaultValue === 'boolean')
          // @ts-ignore
          data.value = defaultValue === 'true'
          // @ts-ignore
        else if (!Number.isNaN(defaultValue))
          // @ts-ignore
          data.value = rawValue != null ? Number.parseFloat(rawValue) : defaultValue
        else
          // @ts-ignore
          data.value = rawValue != null ? rawValue : defaultValue
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
          storage.setItem(key, String(data.value))
      }
      catch (e) {
        console.warn(e)
      }
    },
    { flush: 'sync', lazy: true },
  )

  return data
}
