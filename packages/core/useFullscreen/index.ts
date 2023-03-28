import { computed, ref, watchEffect } from 'vue-demi'
import { tryOnScopeDispose } from '@vueuse/shared'
import type { Fn } from '@vueuse/shared'
import type { MaybeElementRef } from '../unrefElement'
import { unrefElement } from '../unrefElement'
import { useEventListener } from '../useEventListener'
import type { ConfigurableDocument } from '../_configurable'
import { defaultDocument } from '../_configurable'
import { useSupported } from '../useSupported'

export interface UseFullscreenOptions extends ConfigurableDocument {
  /**
   * Automatically exit fullscreen when component is unmounted
   *
   * @default false
   */
  autoExit?: boolean
}

const eventHandlers = [
  'fullscreenchange',
  'webkitfullscreenchange',
  'webkitendfullscreen',
  'mozfullscreenchange',
  'MSFullscreenChange'] as any as 'fullscreenchange'

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
  const targetRef = target ?? document?.querySelector('html')
  const isFullscreen = ref(false)
  let targetHandlerCleanup: Fn

  const requestMethod = computed<'requestFullscreen' | undefined>(() => {
    const target = unrefElement(targetRef)
    return [
      'requestFullscreen',
      'webkitRequestFullscreen',
      'webkitEnterFullscreen',
      'webkitEnterFullScreen',
      'webkitRequestFullScreen',
      'mozRequestFullScreen',
      'msRequestFullscreen',
    ].find(m => (document && m in document) || (target && m in target)) as any
  })
  const exitMethod = computed<'exitFullscreen' | undefined>(() => {
    const target = unrefElement(targetRef)
    return [
      'exitFullscreen',
      'webkitExitFullscreen',
      'webkitExitFullScreen',
      'webkitCancelFullScreen',
      'mozCancelFullScreen',
      'msExitFullscreen',
    ].find(m => (document && m in document) || (target && m in target)) as any
  })
  const fullscreenEnabled = computed<'fullscreenEnabled' | undefined>(() => {
    const target = unrefElement(targetRef)
    return [
      'fullScreen',
      'webkitIsFullScreen',
      'webkitDisplayingFullscreen',
      'mozFullScreen',
      'msFullscreenElement',
    ].find(m => (document && m in document) || (target && m in target)) as any
  })

  const isSupported = useSupported(() =>
    unrefElement(targetRef)
    && document
    && requestMethod.value !== undefined
    && exitMethod.value !== undefined
    && fullscreenEnabled.value !== undefined,
  )

  const isElementFullScreen = (): boolean => {
    if (fullscreenEnabled.value) {
      if (document && document[fullscreenEnabled.value] !== undefined && document[fullscreenEnabled.value] !== null) {
        return document[fullscreenEnabled.value]
      }
      else {
        const target = unrefElement(targetRef)
        // @ts-expect-error - Fallback for WebKit and iOS Safari browsers
        if (target[fullscreenEnabled.value] !== undefined && target[fullscreenEnabled.value] !== null) {
          // @ts-expect-error - Fallback for WebKit and iOS Safari browsers
          return Boolean(target[fullscreenEnabled.value])
        }
      }
    }
    return false
  }

  async function exit() {
    if (!isSupported.value)
      return
    if (exitMethod.value) {
      if (document?.[exitMethod.value] !== undefined) {
        await document[exitMethod.value]()
      }
      else {
        const target = unrefElement(targetRef)
        // @ts-expect-error - Fallback for Safari iOS
        if (target[exitMethod.value] !== undefined)
        // @ts-expect-error - Fallback for Safari iOS
          await target[exitMethod.value]()
      }
    }

    isFullscreen.value = false
  }

  async function enter() {
    if (!isSupported.value)
      return

    if (isElementFullScreen())
      await exit()

    const target = unrefElement(targetRef)
    if (target && requestMethod.value && target[requestMethod.value] !== undefined) {
      await target[requestMethod.value]()
      isFullscreen.value = true
    }
  }

  async function toggle() {
    await (isFullscreen.value ? exit() : enter())
  }

  const handlerCallback = () => {
    isFullscreen.value = isElementFullScreen()
  }

  useEventListener(document, eventHandlers, handlerCallback, false)
  watchEffect(() => {
    const target = unrefElement(targetRef)

    if (targetHandlerCleanup)
      targetHandlerCleanup()

    targetHandlerCleanup = useEventListener(target, eventHandlers, handlerCallback, false)
  })

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
