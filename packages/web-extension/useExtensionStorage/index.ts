import type { Ref } from 'vue-demi'
import { ref, watch } from 'vue-demi'
import type { ExtensionStorageType } from '../_types'

// @ts-expect-error types available in extension environment
// eslint-disable-next-line @typescript-eslint/no-use-before-define
const browser = typeof chrome !== 'undefined' ? chrome : browser

async function setData(storageType: ExtensionStorageType, key: string, value: any) {
  browser.storage[storageType].set({ [key]: value })
}

async function getData(storageType: ExtensionStorageType, key: string) {
  const items = await browser.storage[storageType].get(key)

  return items[key]
}

export function useExtensionStorage<T>(key: string): Ref<T>
export function useExtensionStorage<T>(key: string, storageType?: ExtensionStorageType): Ref<T>

/**
 * Reactive browser (web-extensions) storage
 *
 * @see https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage
 * @see https://vueuse.org/useExtensionStorage
 */
export function useExtensionStorage(...args: any[]): Ref<any> {
  const data = ref<any>()
  let storageType: ExtensionStorageType = 'local'
  let key = ''

  if (
    !args || args.length === 0
  )
    throw new Error('Storage key not specified, please see usage example here: https://vueuse.org/useExtensionStorage')

  // set key
  key = args[0]

  // check if storage type is specified
  if (args[1])
    storageType = args[1]

  // get initial value
  getData(storageType, key).then((value) => {
    data.value = value
  })

  watch(
    data,
    (f, o) => {
      if (f !== o)
        setData(storageType, key, f)
    }, { immediate: true })

  return data
}
