import type { ConfigurableWindow } from '@vueuse/core'
import type { ConfigurableFlush, RemovableRef } from '@vueuse/shared'
import type { ComputedRef, MaybeRefOrGetter, Ref, ShallowRef } from 'vue'
import { defaultWindow, tryOnScopeDispose, useSupported, watchPausable } from '@vueuse/core'
import { del, get, set, update } from 'idb-keyval'
import { ref as deepRef, nextTick, shallowRef, toRaw, toValue } from 'vue'

interface Serializer<T> {
  read: (raw: unknown) => T
  write: (value: T) => unknown
}

export interface UseIDBOptions<T> extends ConfigurableFlush, ConfigurableWindow {
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

  /**
   * Listen to storage changes from other tabs via BroadcastChannel,
   * useful for multiple tabs applications
   *
   * @default true
   */
  listenToStorageChanges?: boolean
}

export interface UseIDBKeyvalReturn<T> {
  data: RemovableRef<T>
  isFinished: ShallowRef<boolean>
  isSupported: ComputedRef<boolean>
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
    listenToStorageChanges = true,
    window = defaultWindow,
    serializer = {
      read: (raw: unknown) => raw as T,
      write: (value: T) => value,
    },
  } = options

  const isSupported = useSupported(() => window && 'BroadcastChannel' in window)

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

  let channel: BroadcastChannel | undefined

  async function write(broadcastChange = true) {
    try {
      if (data.value == null) {
        await del(key)
        if (broadcastChange)
          channel?.postMessage({ type: 'delete' })
      }
      else {
        const rawValue = toRaw(data.value)
        const serializedValue = serializer.write(rawValue)
        await update(key, () => serializedValue)
        if (broadcastChange)
          channel?.postMessage({ type: 'set', value: serializedValue })
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

  if (listenToStorageChanges && isSupported.value) {
    channel = new BroadcastChannel(`vueuse-idb-${JSON.stringify(key)}`)
    tryOnScopeDispose(() => channel?.close())

    channel.addEventListener('message', (event: MessageEvent) => {
      const { type, value } = event.data ?? {}
      pauseWatch()
      try {
        if (type === 'delete')
          data.value = rawInit
        else if (type === 'set')
          data.value = serializer.read(value)
      }
      catch (e) {
        onError(e)
      }
      finally {
        nextTick(resumeWatch)
      }
    })
  }

  async function setData(value: T): Promise<void> {
    pauseWatch()
    data.value = value
    await write()
    resumeWatch()
  }

  return {
    set: setData,
    isFinished,
    isSupported,
    data: data as RemovableRef<T>,
  }
}
