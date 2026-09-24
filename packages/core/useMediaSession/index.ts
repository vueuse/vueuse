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
   * The **`album`** property of the `MediaMetadata` interface returns or sets the name of the album or collection containing the media to be played.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/MediaMetadata/album)
   */
  album: ShallowRef<MediaMetadataInit['album']>
  /**
   * The **`artist`** property of the `MediaMetadata` interface returns or sets the name of the artist, group, creator, etc., of the media to be played.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/MediaMetadata/artist)
   */
  artist: ShallowRef<MediaMetadataInit['artist']>
  /**
   * The **`artwork`** property of the `MediaMetadata` interface returns or sets an array of objects representing images associated with playing media.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/MediaMetadata/artwork)
   */
  artwork: ShallowRef<MediaMetadataInit['artwork']>
  /**
   * The **`title`** property of the `MediaMetadata` interface returns or sets the title of the media to be played.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/MediaMetadata/title)
   */
  title: ShallowRef<MediaMetadataInit['title']>
  /**
   * A floating-point value giving the total duration of the current media in seconds.
   * This should always be a positive number, with positive infinity (`Infinity`) indicating media
   * without a defined end, such as a live stream.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/MediaSession/setPositionState#duration)
   */
  duration: ShallowRef<MediaPositionState['duration']>
  /**
   * A floating-point value indicating the rate at which the media is being played,
   * as a ratio relative to its normal playback speed. Thus, a value of 1 is playing at normal speed,
   * 2 is playing at double speed, and so forth. Negative values indicate that the media is playing in reverse;
   * -1 indicates playback at the normal speed but backward, -2 is double speed in reverse, and so on.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/MediaSession/setPositionState#playbackrate)
   */
  playbackRate: ShallowRef<MediaPositionState['playbackRate']>
  /**
   * A floating-point value indicating the last reported playback position of the media in seconds. This must always be a positive value.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/MediaSession/setPositionState#position)
   */
  position: ShallowRef<MediaPositionState['position']>
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

  const album = shallowRef<MediaMetadataInit['album']>()
  const artist = shallowRef<MediaMetadataInit['artist']>()
  const artwork = shallowRef<MediaMetadataInit['artwork']>()
  const title = shallowRef<MediaMetadataInit['title']>()

  const duration = shallowRef<MediaPositionState['duration']>()
  const playbackRate = shallowRef<MediaPositionState['playbackRate']>()
  const position = shallowRef<MediaPositionState['position']>()

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
          album: album.value,
          artist: artist.value,
          artwork: artwork.value,
          title: title.value,
        })
      })

      watchEffect(() => {
        navigator.mediaSession.playbackState = playbackState.value
      })

      watchEffect(() => {
        navigator.mediaSession.setPositionState({
          duration: duration.value,
          playbackRate: playbackRate.value,
          position: position.value,
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
        watchEffect(() => navigator.mediaSession.setMicrophoneActive(microphoneActive.value))
      }
    })
  }
  /**
   * Method for clearing the MediaSession
   */
  function clear() {
    if (!isSupported.value)
      return false

    album.value = undefined
    artist.value = undefined
    artwork.value = []
    title.value = undefined

    duration.value = undefined
    playbackRate.value = undefined
    position.value = undefined

    playbackState.value = 'none'
    actionHandlers.value = {}
  }

  // Clear MediaSession on dispose
  tryOnScopeDispose(clear)

  return {
    isSupported,
    album,
    artist,
    artwork,
    title,
    duration,
    playbackRate,
    position,
    playbackState,
    actionHandlers,
    cameraActive,
    microphoneActive,
    isSetCameraSupported,
    isSetMicrophoneSupported,
    clear,
  }
}
