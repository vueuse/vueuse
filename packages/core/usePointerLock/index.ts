import type { ConfigurableDocument } from '../_configurable'
import type { MaybeElementRef } from '../unrefElement'
import { until } from '@vueuse/shared'
import { ref } from 'vue'
import { defaultDocument } from '../_configurable'
import { unrefElement } from '../unrefElement'
import { useEventListener } from '../useEventListener'
import { useSupported } from '../useSupported'

// declare global {
//   interface PointerLockOptions {
//     unadjustedMovement?: boolean
//   }
// }

type MaybeHTMLElement = HTMLElement | undefined | null

export interface UsePointerLockOptions extends ConfigurableDocument {
  // pointerLockOptions?: PointerLockOptions
}

/**
 * Reactive pointer lock.
 *
 * @see https://vueuse.org/usePointerLock
 * @param target
 * @param options
 */
export function usePointerLock(target?: MaybeElementRef<MaybeHTMLElement>, options: UsePointerLockOptions = {}) {
  const { document = defaultDocument } = options

  const isSupported = useSupported(() => document && 'pointerLockElement' in document)

  const element = ref<MaybeHTMLElement>()

  const triggerElement = ref<MaybeHTMLElement>()

  let targetElement: MaybeHTMLElement

  if (isSupported.value) {
    const listenerOptions = { passive: true }

    useEventListener(document, 'pointerlockchange', () => {
      const currentElement = document!.pointerLockElement ?? element.value
      if (targetElement && currentElement === targetElement) {
        element.value = document!.pointerLockElement as MaybeHTMLElement
        if (!element.value)
          targetElement = triggerElement.value = null
      }
    }, listenerOptions)

    useEventListener(document, 'pointerlockerror', () => {
      const currentElement = document!.pointerLockElement ?? element.value
      if (targetElement && currentElement === targetElement) {
        const action = document!.pointerLockElement ? 'release' : 'acquire'
        throw new Error(`Failed to ${action} pointer lock.`)
      }
    }, listenerOptions)
  }

  async function lock(
    e: MaybeElementRef<MaybeHTMLElement> | Event,
    // options?: PointerLockOptions,
  ) {
    if (!isSupported.value)
      throw new Error('Pointer Lock API is not supported by your browser.')

    triggerElement.value = e instanceof Event ? <HTMLElement>e.currentTarget : null
    targetElement = e instanceof Event ? unrefElement(target) ?? triggerElement.value : unrefElement(e)
    if (!targetElement)
      throw new Error('Target element undefined.')
    targetElement.requestPointerLock()

    return await until(element).toBe(targetElement)
  }

  async function unlock() {
    if (!element.value)
      return false

    document!.exitPointerLock()

    await until(element).toBeNull()
    return true
  }

  return {
    isSupported,
    element,
    triggerElement,
    lock,
    unlock,
  }
}

export type UsePointerLockReturn = ReturnType<typeof usePointerLock>
