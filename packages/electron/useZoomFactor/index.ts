import type { WebFrame } from 'electron'
import type { Ref } from 'vue-demi'
import { isRef, ref, watch } from 'vue-demi'
import type { MaybeRef } from '@vueuse/shared'
import { isNumber } from '@vueuse/shared'

export function useZoomFactor(factor: MaybeRef<number>): Ref<number>
export function useZoomFactor(webFrame: WebFrame, factor: MaybeRef<number>): Ref<number>
export function useZoomFactor(webFrame: WebFrame): Ref<number>
export function useZoomFactor(): Ref<number>

/**
 * Reactive WebFrame zoom factor
 *
 * @see https://www.electronjs.org/docs/api/web-frame#webframesetzoomfactorfactor
 * @see https://vueuse.org/useZoomFactor
 */
export function useZoomFactor(...args: any[]): Ref<number> {
  let webFrame: WebFrame | undefined
  let newFactor: Ref<number> | null = null

  if (
    args.length === 0
        || (isRef(args[0]) && isNumber(args[0].value))
        || isNumber(args[0])
  ) {
    webFrame = window.require ? window.require('electron').webFrame : undefined
    newFactor = args.length > 0 ? ref(args[0]) : null
  }
  else {
    webFrame = args[0]
    newFactor = args.length > 1 ? ref(args[1]) : null
  }

  if (!webFrame)
    throw new Error('provide WebFrame module or enable nodeIntegration')

  if (newFactor && newFactor.value === 0)
    throw new Error('the factor must be greater than 0.0.')

  const factor = ref(newFactor ?? webFrame.getZoomFactor())

  watch(
    factor,
    (f, o) => {
      if (isNumber(f) && f === 0)
        throw new Error('the factor must be greater than 0.0.')

      if (isNumber(f) && f !== o)
        webFrame?.setZoomFactor(f)
    }, { immediate: true })

  return factor
}
