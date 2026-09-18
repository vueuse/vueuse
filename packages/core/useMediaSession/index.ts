import type { Ref, ShallowRef } from 'vue'
import type { Supportable } from '../types'
import type { UseSupportedReturn } from '../useSupported'
import { tryOnMounted, tryOnScopeDispose, watchDeep } from '@vueuse/shared'
import { ref as deepRef, shallowRef, watchEffect } from 'vue'
import { useSupported } from '../useSupported'

/**
 * Many of the jsdoc definitions here are modified version of the
 * documentation from MDN(https://developer.mozilla.org/en-US/docs/Web/API/MediaSession)
 */

export interface UseMediaSessionReturn extends Supportable {
  /**
   * The **`MediaMetadata`** interface of the Media Session API allows a web page to provide rich media metadata for display in a platform UI.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/MediaMetadata)
   */
  metadata: Ref<MediaMetadataInit | null>
  /**
   * An object providing updated information about the playback position and speed of the document's ongoing media. If the object is empty, the existing playback state information is cleared.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/MediaSession/setPositionState)
   */
  positionState: Ref<MediaPositionState | undefined>
  /**
   * The **`playbackState`** property of the `MediaSession` interface indicates whether the current media session is playing or paused.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/MediaSession/playbackState)
   */
  playbackState: ShallowRef<MediaSessionPlaybackState>
  /**
   * Handlers for a media session action. These actions let a web app receive notifications
   * when the user engages a device's built-in physical or onscreen media controls,
   * such as play, stop, or seek buttons.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/MediaSession/setActionHandler)
   */
  actionHandlers: Ref<Partial<Record<MediaSessionAction, MediaSessionActionHandler> | undefined>>
  /**
   * Indicate to the user agent whether the user's camera is considered to be active.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/MediaSession/setCameraActive)
   */
  cameraActive: ShallowRef<boolean>
  /**
   * Indicate to the user agent whether the user's microphone is considered to be currently muted.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/MediaSession/setMicrophoneActive)
   */
  microphoneActive: ShallowRef<boolean>
  /**
   * Whether `mediaSession.setCameraActive()` is supported by the browser.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/MediaSession/setCameraActive)
   */
  isSetCameraSupported: UseSupportedReturn
  /**
   * Whether `mediaSession.setMicrophoneActive()` is supported by the browser.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/MediaSession/setMicrophoneActive)
   */
  isSetMicrophoneSupported: UseSupportedReturn
  /**
   * Method for clearing the Media Session.
   */
  clear: () => void
}

/**
 * Reactive Media Query.
 *
 * @see https://vueuse.org/useMediaSession
 */
export function useMediaSession(): UseMediaSessionReturn {
  // throw new Error('Media Session API is not supported by your browser.')
  const isSupported = useSupported(() => navigator && 'mediaSession' in navigator)

  const metadata = deepRef<MediaMetadataInit | null>(null)
  const positionState = deepRef<MediaPositionState>()
  const playbackState = shallowRef<MediaSessionPlaybackState>('none')
  const actionHandlers = deepRef<Partial<Record<MediaSessionAction, MediaSessionActionHandler>>>()

  const cameraActive = shallowRef(false)
  const microphoneActive = shallowRef(false)

  const isSetCameraSupported = useSupported(() => navigator && 'mediaSession' in navigator && 'setCameraActive' in navigator.mediaSession)
  const isSetMicrophoneSupported = useSupported(() => navigator && 'mediaSession' in navigator && 'setMicrophoneActive' in navigator.mediaSession)

  if (isSupported.value) {
    tryOnMounted(() => {
      watchEffect(() => {
        navigator.mediaSession.metadata = new MediaMetadata({
          album: metadata.value?.album,
          artist: metadata.value?.artist,
          artwork: metadata.value?.artwork,
          title: metadata.value?.title,
        })
      })

      watchEffect(() => {
        navigator.mediaSession.playbackState = playbackState.value
      })

      watchEffect(() => {
        navigator.mediaSession.setPositionState({
          duration: positionState.value?.duration,
          playbackRate: positionState.value?.playbackRate,
          position: positionState.value?.position,
        })
      })

      watchDeep(actionHandlers, (newHandlers = {}, oldHandlers = {}) => {
        Object.entries(oldHandlers).forEach(([action]) => {
          try {
            navigator.mediaSession.setActionHandler(action as MediaSessionAction, null)
          }
          catch {}
        })
        Object.entries(newHandlers).forEach(([action, handler]) => {
          try {
            navigator.mediaSession.setActionHandler(action as MediaSessionAction, handler)
          }
          catch {}
        })
      })

      if (isSetCameraSupported.value) {
        watchEffect(() => navigator.mediaSession.setCameraActive(cameraActive.value))
      }

      if (isSetMicrophoneSupported.value) {
        watchEffect(() => navigator.mediaSession.setCameraActive(microphoneActive.value))
      }
    })
  }
  /**
   * Method for clearing the MediaSession
   */
  function clear() {
    if (!isSupported.value)
      return false

    metadata.value = null
    playbackState.value = 'none'
    positionState.value = undefined
    actionHandlers.value = {}
  }

  // Clear MediaSession on dispose
  tryOnScopeDispose(clear)

  return {
    isSupported,
    metadata,
    positionState,
    playbackState,
    actionHandlers,
    cameraActive,
    microphoneActive,
    isSetCameraSupported,
    isSetMicrophoneSupported,
    clear,
  }
}
