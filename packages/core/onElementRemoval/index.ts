import type { WatchOptionsBase } from 'vue'
import type { ConfigurableDocumentOrShadowRoot, ConfigurableWindow } from '../_configurable'
import type { MaybeElementRef } from '../unrefElement'
import { tryOnScopeDispose } from '@vueuse/shared'
import { ref, watchEffect } from 'vue'
import { defaultWindow } from '../_configurable'
import { unrefElement } from '../unrefElement'
import { useMutationObserver } from '../useMutationObserver'

interface OnElementRemovalOptions extends ConfigurableWindow, ConfigurableDocumentOrShadowRoot, WatchOptionsBase { }

interface StopHandle {
  (): void
}

/**
 * Fires when the element or any element containing it is removed.
 *
 * @param target
 * @param callback
 * @param options
 */
export function onElementRemoval(
  target: MaybeElementRef,
  callback: (mutationRecords: MutationRecord[]) => void,
  options: OnElementRemovalOptions = {},
) {
  const {
    window = defaultWindow,
    document = window?.document,
    flush = 'sync',
  } = options
  const stopFn = ref(() => { })
  const cleanupAndUpdate = (fn = () => { }) => {
    stopFn.value?.()
    stopFn.value = fn
  }

  const stopWatch = watchEffect(() => {
    const el = unrefElement(target)
    if (el) {
      const { stop } = useMutationObserver(document as any, (mutationsList) => {
        const targetRemoved = mutationsList
          .map(mutation => [...mutation.removedNodes])
          .flat()
          .some(node => node === el || node.contains(el))

        if (targetRemoved) {
          callback(mutationsList)
        }
      }, {
        window,
        childList: true,
        subtree: true,
      })

      cleanupAndUpdate(stop)
    }
  }, { flush })

  const stopHandle: StopHandle = () => {
    stopWatch()
    cleanupAndUpdate()
  }

  tryOnScopeDispose(stopHandle)

  return stopHandle
}
