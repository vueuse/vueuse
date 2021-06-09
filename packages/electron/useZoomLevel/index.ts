import type { WebFrame } from 'electron'
import { isRef, Ref, ref, watch } from 'vue-demi'
import { MaybeRef, isNumber } from '@vueuse/shared'

export function useZoomLevel(level: MaybeRef<number>): Ref<number>
export function useZoomLevel(webFrame: WebFrame, level: MaybeRef<number>): Ref<number>
export function useZoomLevel(webFrame: WebFrame): Ref<number>
export function useZoomLevel(): Ref<number>

/**
 * Reactive WebFrame zoom level
 *
 * @see https://www.electronjs.org/docs/api/web-frame#webframesetzoomlevellevel
 * @export
 * @param {WebFrame} [webFrame]
 * @returns {Ref<number>}
 */
export function useZoomLevel(...args: any[]): Ref<number> {
  let webFrame: WebFrame | undefined
  let newLevel: Ref<number> | null = null

  if (
    args.length === 0
        || (isRef(args[0]) && isNumber(args[0].value))
        || isNumber(args[0])
  ) {
    webFrame = window.require ? window.require('electron').webFrame : undefined
    newLevel = args.length > 0 ? ref(args[0]) : null
  }
  else {
    webFrame = args[0]
    newLevel = args.length > 1 ? ref(args[1]) : null
  }

  if (!webFrame)
    throw new Error('provide WebFrame module or enable nodeIntegration')

  const level = ref(newLevel ?? webFrame.getZoomLevel())

  watch(
    level,
    (f, o) => {
      if (isNumber(f) && f !== o)
        webFrame?.setZoomLevel(f)
    }, { immediate: true })

  return level
}
