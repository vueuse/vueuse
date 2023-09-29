import { computed, ref } from 'vue-demi'
import { tryOnScopeDispose } from '@vueuse/shared'
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
  'MSFullscreenChange',
] as any as 'fullscreenchange'[]

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
  const {
    document = defaultDocument,
    autoExit = false,
  } = options

  const targetRef = computed(() => unrefElement(target) ?? document?.querySelector('html'))
  const isFullscreen = ref(false)

  const requestMethod = computed<'requestFullscreen' | undefined>(() => {
    return [
      'requestFullscreen',
      'webkitRequestFullscreen',
      'webkitEnterFullscreen',
      'webkitEnterFullScreen',
      'webkitRequestFullScreen',
      'mozRequestFullScreen',
      'msRequestFullscreen',
    ].find(m => (document && m in document) || (targetRef.value && m in targetRef.value)) as any
  })

  const exitMethod = computed<'exitFullscreen' | undefined>(() => {
    return [
      'exitFullscreen',
      'webkitExitFullscreen',
      'webkitExitFullScreen',
      'webkitCancelFullScreen',
      'mozCancelFullScreen',
      'msExitFullscreen',
    ].find(m => (document && m in document) || (targetRef.value && m in targetRef.value)) as any
  })

  const fullscreenEnabled = computed<'fullscreenEnabled' | undefined>(() => {
    return [
      'fullScreen',
      'webkitIsFullScreen',
      'webkitDisplayingFullscreen',
      'mozFullScreen',
      'msFullscreenElement',
    ].find(m => (document && m in document) || (targetRef.value && m in targetRef.value)) as any
  })

  const fullscreenElementMethod = [
    'fullscreenElement',
    'webkitFullscreenElement',
    'mozFullScreenElement',
    'msFullscreenElement',
  ].find(m => (document && m in document)) as 'fullscreenElement' | undefined

  const isSupported = useSupported(() =>
    targetRef.value
    && document
    && requestMethod.value !== undefined
    && exitMethod.value !== undefined
    && fullscreenEnabled.value !== undefined)

  const isCurrentElementFullScreen = (): boolean => {
    if (fullscreenElementMethod)
      return document?.[fullscreenElementMethod] === targetRef.value
    return false
  }

  const isElementFullScreen = (): boolean => {
    if (fullscreenEnabled.value) {
      if (document && document[fullscreenEnabled.value] != null) {
        return document[fullscreenEnabled.value]
      }
      else {
        const target = targetRef.value
        // @ts-expect-error - Fallback for WebKit and iOS Safari browsers
        if (target?.[fullscreenEnabled.value] != null) {
          // @ts-expect-error - Fallback for WebKit and iOS Safari browsers
          return Boolean(target[fullscreenEnabled.value])
        }
      }
    }
    return false
  }

  async function exit() {
    if (!isSupported.value || !isFullscreen.value)
      return
    if (exitMethod.value) {
      if (document?.[exitMethod.value] != null) {
        await document[exitMethod.value]()
      }
      else {
        const target = targetRef.value
        // @ts-expect-error - Fallback for Safari iOS
        if (target?.[exitMethod.value] != null)
          // @ts-expect-error - Fallback for Safari iOS
          await target[exitMethod.value]()
      }
    }

    isFullscreen.value = false
  }

  async function enter() {
    if (!isSupported.value || isFullscreen.value)
      return

    if (isElementFullScreen())
      await exit()

    const target = targetRef.value
    if (requestMethod.value && target?.[requestMethod.value] != null) {
      await target[requestMethod.value]()
      isFullscreen.value = true
    }
  }

  async function toggle() {
    await (isFullscreen.value ? exit() : enter())
  }

  const handlerCallback = () => {
    const isElementFullScreenValue = isElementFullScreen()
    if (!isElementFullScreenValue || (isElementFullScreenValue && isCurrentElementFullScreen()))
      isFullscreen.value = isElementFullScreenValue
  }

  useEventListener(document, eventHandlers, handlerCallback, false)
  useEventListener(() => unrefElement(targetRef), eventHandlers, handlerCallback, false)

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
