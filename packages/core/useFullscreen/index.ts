/* this implementation is original ported from https://github.com/logaretm/vue-use-web by Abdelrahman Awad */

import { ref } from 'vue-demi'
import { tryOnScopeDispose } from '@vueuse/shared'
import type { MaybeElementRef } from '../unrefElement'
import { unrefElement } from '../unrefElement'
import { useEventListener } from '../useEventListener'
import type { ConfigurableDocument } from '../_configurable'
import { defaultDocument } from '../_configurable'
import { useSupported } from '../useSupported'

type FunctionMap = [
  'requestFullscreen',
  'exitFullscreen',
  'fullscreenElement',
  'fullscreenEnabled',
  'fullscreenchange',
  'fullscreenerror',
]

// from: https://github.com/sindresorhus/screenfull.js/blob/master/src/screenfull.js
const functionsMap: FunctionMap[] = [
  [
    'requestFullscreen',
    'exitFullscreen',
    'fullscreenElement',
    'fullscreenEnabled',
    'fullscreenchange',
    'fullscreenerror',
  ],
  // New WebKit
  [
    'webkitRequestFullscreen',
    'webkitExitFullscreen',
    'webkitFullscreenElement',
    'webkitFullscreenEnabled',
    'webkitfullscreenchange',
    'webkitfullscreenerror',
  ],
  // Safari iOS WebKit
  [
    'webkitEnterFullscreen',
    'webkitExitFullscreen',
    'webkitFullscreenElement',
    'webkitFullscreenEnabled',
    'webkitfullscreenchange',
    'webkitfullscreenerror',
  ],
  // Old WebKit
  [
    'webkitRequestFullScreen',
    'webkitCancelFullScreen',
    'webkitCurrentFullScreenElement',
    'webkitCancelFullScreen',
    'webkitfullscreenchange',
    'webkitfullscreenerror',
  ],
  [
    'mozRequestFullScreen',
    'mozCancelFullScreen',
    'mozFullScreenElement',
    'mozFullScreenEnabled',
    'mozfullscreenchange',
    'mozfullscreenerror',
  ],
  [
    'msRequestFullscreen',
    'msExitFullscreen',
    'msFullscreenElement',
    'msFullscreenEnabled',
    'MSFullscreenChange',
    'MSFullscreenError',
  ],
] as any

export interface UseFullscreenOptions extends ConfigurableDocument {
  /**
   * Automatically exit fullscreen when component is unmounted
   *
   * @default false
   */
  autoExit?: boolean
}

/**
 * Reactive Fullscreen API.
 *
 * @see https://vueuse.org/useFullscreen
 * @param target
 * @param options
 */
export function useFullscreen(
  target?: MaybeElementRef,
  options: UseFullscreenOptions = {},
) {
  const { document = defaultDocument, autoExit = false } = options
  const targetRef = target || document?.querySelector('html')
  const isFullscreen = ref(false)
  let map: FunctionMap = functionsMap[0]

  const isSupported = useSupported(() => {
    if (!document) {
      return false
    }
    else {
      const target = unrefElement(targetRef)

      for (const m of functionsMap) {
        if (m[1] in document || (target && m[0] in target)) {
          map = m
          return true
        }
      }
    }
    return false
  })

  const [REQUEST, EXIT, ELEMENT,, EVENT] = map

  async function exit() {
    if (!isSupported.value)
      return
    if (document?.[ELEMENT])
      await document[EXIT]()

    isFullscreen.value = false
  }

  async function enter() {
    if (!isSupported.value)
      return

    await exit()

    const target = unrefElement(targetRef)
    if (target) {
      await target[REQUEST]()
      isFullscreen.value = true
    }
  }

  async function toggle() {
    if (isFullscreen.value)
      await exit()
    else
      await enter()
  }

  if (document) {
    useEventListener(document, EVENT, () => {
      isFullscreen.value = !!document?.[ELEMENT]
    }, false)
  }

  if (autoExit)
    tryOnScopeDispose(exit)

  return {
    isSupported,
    isFullscreen,
    enter,
    exit,
    toggle,
  }
}

export type UseFullscreenReturn = ReturnType<typeof useFullscreen>
