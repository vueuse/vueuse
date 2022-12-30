import { ref } from 'vue-demi'
import { until } from '@vueuse/shared'
import { useEventListener } from '../useEventListener'
import { useSupported } from '../useSupported'
import { unrefElement } from '../unrefElement'
import type { MaybeElementRef } from '../unrefElement'
import type { ConfigurableDocument } from '../_configurable'
import { defaultDocument } from '../_configurable'

type MaybeHTMLElement = HTMLElement | undefined | null

/**
 * Reactive pointer lock.
 *
 * @see https://vueuse.org/usePointerLock
 * @param target
 * @param options
 */
export function usePointerLock(target?: MaybeElementRef<MaybeHTMLElement>, options: ConfigurableDocument = {}) {
  const { document = defaultDocument } = options

  const isSupported = useSupported(() => document && 'pointerLockElement' in document)

  const element = ref<MaybeHTMLElement>()

  let targetElement: MaybeHTMLElement

  if (isSupported.value) {
    useEventListener(document, 'pointerlockchange', () => {
      const currentElement = document!.pointerLockElement ?? element.value
      if (targetElement && currentElement === targetElement)
        element.value = document!.pointerLockElement as MaybeHTMLElement
    })

    useEventListener(document, 'pointerlockerror', () => {
      const currentElement = document!.pointerLockElement ?? element.value
      if (targetElement && currentElement === targetElement) {
        const action = document!.pointerLockElement ? 'release' : 'acquire'
        throw new Error(`Failed to ${action} pointer lock.`)
      }
    })
  }

  async function lock(e: MaybeElementRef<MaybeHTMLElement> | Event) {
    if (!isSupported.value)
      throw new Error('Pointer Lock API is not supported by your browser.')

    targetElement = e instanceof Event ? unrefElement(target) ?? <HTMLElement>e.currentTarget : unrefElement(e)
    if (!targetElement)
      throw new Error('Target element undefined.')
    targetElement.requestPointerLock()

    return await until(element).toBe(targetElement)
  }

  async function unlock() {
    element.value && document!.exitPointerLock()

    await until(element).toBe(null)
    targetElement = null
  }

  return {
    isSupported,
    element,
    lock,
    unlock,
  }
}

export type UsePointerLockReturn = ReturnType<typeof usePointerLock>
