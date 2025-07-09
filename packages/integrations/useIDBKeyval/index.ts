import type { ConfigurableFlush, RemovableRef } from '@vueuse/shared'
import type { MaybeRefOrGetter, Ref, ShallowRef } from 'vue'
import { watchPausable } from '@vueuse/core'
import { del, get, set, update } from 'idb-keyval'
import { ref as deepRef, shallowRef, toRaw, toValue } from 'vue'

interface Serializer<T> {
  read: (raw: unknown) => T
  write: (value: T) => unknown
}

export interface UseIDBOptions<T> extends ConfigurableFlush {
  /**
   * Watch for deep changes
   *
   * @default true
   */
  deep?: boolean

  /**
   * On error callback
   *
   * Default log error to `console.error`
   */
  onError?: (error: unknown) => void

  /**
   * Use shallow ref as reference
   *
   * @default false
   */
  shallow?: boolean
  /**
   * Write the default value to the storage when it does not exist
   *
   * @default true
   */
  writeDefaults?: boolean

  /**
   * Custom data serialization
   */
  serializer?: Serializer<T>
}

export interface UseIDBKeyvalReturn<T> {
  data: RemovableRef<T>
  isFinished: ShallowRef<boolean>
  set: (value: T) => Promise<void>
}

/**
 *
 * @param key
 * @param initialValue
 * @param options
 */
export function useIDBKeyval<T>(
  key: IDBValidKey,
  initialValue: MaybeRefOrGetter<T>,
  options: UseIDBOptions<T> = {},
): UseIDBKeyvalReturn<T> {
  const {
    flush = 'pre',
    deep = true,
    shallow = false,
    onError = (e) => {
      console.error(e)
    },
    writeDefaults = true,
    serializer = {
      read: (raw: unknown) => raw as T,
      write: (value: T) => value,
    },
  } = options

  const isFinished = shallowRef(false)
  const data = (shallow ? shallowRef : deepRef)(initialValue) as Ref<T>

  const rawInit: T = toValue(initialValue)

  async function read() {
    try {
      const rawValue = await get<T>(key)
      if (rawValue === undefined) {
        if (rawInit !== undefined && rawInit !== null && writeDefaults) {
          const initValue = serializer.write(rawInit)
          await set(key, initValue)
        }
      }
      else {
        data.value = serializer.read(rawValue)
      }
    }
    catch (e) {
      onError(e)
    }
    isFinished.value = true
  }

  read()

  async function write() {
    try {
      if (data.value == null) {
        await del(key)
      }
      else {
        const rawValue = toRaw(data.value)
        const serializedValue = serializer.write(rawValue)
        await update(key, () => serializedValue)
      }
    }
    catch (e) {
      onError(e)
    }
  }

  const {
    pause: pauseWatch,
    resume: resumeWatch,
  } = watchPausable(data, () => write(), { flush, deep })

  async function setData(value: T): Promise<void> {
    pauseWatch()
    data.value = value
    await write()
    resumeWatch()
  }

  return {
    set: setData,
    isFinished,
    data: data as RemovableRef<T>,
  }
}
