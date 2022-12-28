import { ref } from 'vue-demi'
import { createSharedComposable, until } from '@vueuse/shared'
import { useEventListener } from '../useEventListener'
import { useSupported } from '../useSupported'
import { unrefElement } from '../unrefElement'
import type { MaybeElement, MaybeElementRef } from '../unrefElement'
import type { ConfigurableDocument } from '../_configurable'
import { defaultDocument } from '../_configurable'

const useSharedEventListener = createSharedComposable(useEventListener)

/**
 * Reactive pointer lock.
 *
 * @see https://vueuse.org/usePointerLock
 * @param target
 * @param options
 */
export function usePointerLock(target?: MaybeElementRef, options: ConfigurableDocument = {}) {
  const { document = defaultDocument } = options

  const isSupported = useSupported(() => document && 'pointerLockElement' in document)

  const element = ref<MaybeElement>()

  if (isSupported.value) {
    useSharedEventListener(document, 'pointerlockchange', () => {
      element.value = document!.pointerLockElement as MaybeElement
    })

    useSharedEventListener(document, 'pointerlockerror', () => {
      const action = document!.pointerLockElement ? 'release' : 'acquire'
      throw new Error(`Failed to ${action} pointer lock.`)
    })
  }

  async function lock(e: MaybeElementRef | Event) {
    if (!isSupported.value)
      throw new Error('Pointer Lock API is not supported by your browser.')

    const targetElement = e instanceof Event ? unrefElement(target) ?? <Element>e.target : unrefElement(e)
    if (!targetElement)
      throw new Error('Target element undefined.')
    targetElement.requestPointerLock()

    return await until(element).toBe(targetElement)
  }

  async function unlock() {
    element.value && document!.exitPointerLock()

    return await until(element).toBe(null)
  }

  return {
    isSupported,
    element,
    lock,
    unlock,
  }
}

export type UsePointerLockReturn = ReturnType<typeof usePointerLock>
