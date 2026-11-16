import type { MaybeRefInitials } from '@vueuse/shared'
import type { ToRefs } from 'vue'
import type { ConfigurableNavigator, Supportable } from '../types'
import type { UseSupportedReturn } from '../useSupported'
import { tryOnScopeDispose } from '@vueuse/shared'
import { ref as deepRef, shallowRef, watchEffect } from 'vue'
import { defaultNavigator } from '../_configurable'
import { useSupported } from '../useSupported'

/**
 * Many of the jsdoc definitions here are modified version of the
 * documentation from MDN(https://developer.mozilla.org/en-US/docs/Web/API/MediaSession)
 */

export interface UseMediaSessionState {
  /**
   * The **`album`** property of the `MediaMetadata` interface returns or sets the name of the album or collection containing the media to be played.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/MediaMetadata/album)
   *
   * @default undefined
   */
  album: MediaMetadataInit['album']
  /**
   * The **`artist`** property of the `MediaMetadata` interface returns or sets the name of the artist, group, creator, etc., of the media to be played.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/MediaMetadata/artist)
   *
   * @default undefined
   */
  artist: MediaMetadataInit['artist']
  /**
   * The **`artwork`** property of the `MediaMetadata` interface returns or sets an array of objects representing images associated with playing media.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/MediaMetadata/artwork)
   *
   * @default undefined
   */
  artwork: MediaMetadataInit['artwork']
  /**
   * The **`title`** property of the `MediaMetadata` interface returns or sets the title of the media to be played.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/MediaMetadata/title)
   *
   * @default undefined
   */
  title: MediaMetadataInit['title']
  /**
   * A floating-point value giving the total duration of the current media in seconds.
   * This should always be a non-negative number, with positive infinity (`Infinity`) indicating media
   * without a defined end, such as a live stream.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/MediaSession/setPositionState#duration)
   *
   * @default undefined
   */
  duration: MediaPositionState['duration']
  /**
   * A floating-point value indicating the rate at which the media is being played,
   * as a ratio relative to its normal playback speed. Thus, a value of 1 is playing at normal speed,
   * 2 is playing at double speed, and so forth. Negative values indicate that the media is playing in reverse;
   * -1 indicates playback at the normal speed but backward, -2 is double speed in reverse, and so on.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/MediaSession/setPositionState#playbackrate)
   *
   * @default undefined
   */
  playbackRate: MediaPositionState['playbackRate']
  /**
   * A floating-point value indicating the last reported playback position of the media in seconds. This must be between zero and the duration, inclusive.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/MediaSession/setPositionState#position)
   *
   * @default undefined
   */
  position: MediaPositionState['position']
  /**
   * The **`playbackState`** property of the `MediaSession` interface indicates whether the current media session is playing or paused.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/MediaSession/playbackState)
   *
   * @default 'none'
   */
  playbackState: MediaSessionPlaybackState
  /**
   * Indicate to the user agent whether the user's camera is considered to be active.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/MediaSession/setCameraActive)
   *
   * @default false
   */
  cameraActive: boolean
  /**
   * Indicate to the user agent whether the user's microphone is considered to be active.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/MediaSession/setMicrophoneActive)
   *
   * @default false
   */
  microphoneActive: boolean
}

export interface UseMediaSessionOptions extends ConfigurableNavigator {
  /**
   * Initial values for the returned state, published to the session on setup.
   * A passed ref is used as the internal state.
   */
  initials?: MaybeRefInitials<UseMediaSessionState>
  /**
   * Called when the user asks to start playback.
   * Registers the `play` action, so the browser may show a matching control.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/MediaSession/setActionHandler#play)
   */
  onPlay?: MediaSessionActionHandler
  /**
   * Called when the user asks to pause playback.
   * Registers the `pause` action, so the browser may show a matching control.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/MediaSession/setActionHandler#pause)
   */
  onPause?: MediaSessionActionHandler
  /**
   * Called when the user asks to stop playback and clear the state.
   * Registers the `stop` action, so the browser may show a matching control.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/MediaSession/setActionHandler#stop)
   */
  onStop?: MediaSessionActionHandler
  /**
   * Called when the user asks to seek backward. `details.seekOffset` holds the offset in seconds, if any.
   * Registers the `seekbackward` action, so the browser may show a matching control.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/MediaSession/setActionHandler#seekbackward)
   */
  onSeekBackward?: MediaSessionActionHandler
  /**
   * Called when the user asks to seek forward. `details.seekOffset` holds the offset in seconds, if any.
   * Registers the `seekforward` action, so the browser may show a matching control.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/MediaSession/setActionHandler#seekforward)
   */
  onSeekForward?: MediaSessionActionHandler
  /**
   * Called when the user asks to seek to a position. `details.seekTime` holds the target time in seconds.
   * Registers the `seekto` action, so the browser may show a matching control.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/MediaSession/setActionHandler#seekto)
   */
  onSeekTo?: MediaSessionActionHandler
  /**
   * Called when the user asks to go to the previous track.
   * Registers the `previoustrack` action, so the browser may show a matching control.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/MediaSession/setActionHandler#previoustrack)
   */
  onPreviousTrack?: MediaSessionActionHandler
  /**
   * Called when the user asks to go to the next track.
   * Registers the `nexttrack` action, so the browser may show a matching control.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/MediaSession/setActionHandler#nexttrack)
   */
  onNextTrack?: MediaSessionActionHandler
  /**
   * Called when the user asks to skip the currently playing advertisement.
   * Registers the `skipad` action, so the browser may show a matching control.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/MediaSession/setActionHandler#skipad)
   */
  onSkipAd?: MediaSessionActionHandler
}

const actionOptions = {
  play: 'onPlay',
  pause: 'onPause',
  stop: 'onStop',
  seekbackward: 'onSeekBackward',
  seekforward: 'onSeekForward',
  seekto: 'onSeekTo',
  previoustrack: 'onPreviousTrack',
  nexttrack: 'onNextTrack',
  skipad: 'onSkipAd',
} as const satisfies Record<MediaSessionAction, keyof UseMediaSessionOptions>

/**
 * The state refs stay writable: writing to them is how the session is updated.
 */
export interface UseMediaSessionReturn extends Supportable, ToRefs<UseMediaSessionState> {
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
   * Reset metadata, playback, and camera/microphone state.
   * Action handlers from the `on*` options stay registered until the scope is disposed.
   * The session can be populated again after clearing.
   */
  clear: () => void
}

/**
 * Reactive Media Session API.
 *
 * @see https://vueuse.org/useMediaSession
 */
export function useMediaSession(options: UseMediaSessionOptions = {}): UseMediaSessionReturn {
  const {
    navigator = defaultNavigator,
    initials: {
      album: initialAlbum,
      artist: initialArtist,
      artwork: initialArtwork,
      title: initialTitle,
      duration: initialDuration,
      playbackRate: initialPlaybackRate,
      position: initialPosition,
      playbackState: initialPlaybackState = 'none',
      cameraActive: initialCameraActive = false,
      microphoneActive: initialMicrophoneActive = false,
    } = {},
  } = options

  const isSupported = useSupported(() => navigator && 'mediaSession' in navigator)

  const album = shallowRef(initialAlbum)
  const artist = shallowRef(initialArtist)
  const artwork = deepRef(initialArtwork)
  const title = shallowRef(initialTitle)

  const duration = shallowRef(initialDuration)
  const playbackRate = shallowRef(initialPlaybackRate)
  const position = shallowRef(initialPosition)

  const playbackState = shallowRef(initialPlaybackState)

  const registeredActions: MediaSessionAction[] = []

  const cameraActive = shallowRef(initialCameraActive)
  const microphoneActive = shallowRef(initialMicrophoneActive)

  const isSetCameraSupported = useSupported(() => navigator && 'mediaSession' in navigator && 'setCameraActive' in navigator.mediaSession)
  const isSetMicrophoneSupported = useSupported(() => navigator && 'mediaSession' in navigator && 'setMicrophoneActive' in navigator.mediaSession)

  if (isSupported.value) {
    watchEffect(() => {
      const metadata: MediaMetadataInit = {
        album: album.value,
        artist: artist.value,
        artwork: artwork.value,
        title: title.value,
      }
      navigator!.mediaSession.metadata = Object.values(metadata).every(value => value === undefined)
        ? null
        : new MediaMetadata(metadata)
    })

    watchEffect(() => {
      navigator!.mediaSession.playbackState = playbackState.value
    })

    watchEffect(() => {
      // A nonempty position state requires a duration, which may not be loaded yet.
      if (duration.value === undefined) {
        navigator!.mediaSession.setPositionState()
        return
      }
      navigator!.mediaSession.setPositionState({
        duration: duration.value,
        playbackRate: playbackRate.value,
        position: position.value,
      })
    })

    for (const [action, option] of Object.entries(actionOptions) as [MediaSessionAction, keyof typeof options][]) {
      const handler = options[option] as MediaSessionActionHandler | undefined
      if (!handler)
        continue
      try {
        navigator!.mediaSession.setActionHandler(action, handler)
        registeredActions.push(action)
      }
      // The browser throws for actions it does not support
      catch {}
    }

    if (isSetCameraSupported.value) {
      watchEffect(() => navigator!.mediaSession.setCameraActive(cameraActive.value))
    }

    if (isSetMicrophoneSupported.value) {
      watchEffect(() => navigator!.mediaSession.setMicrophoneActive(microphoneActive.value))
    }
  }

  /**
   * Method for clearing the MediaSession
   */
  function clear() {
    if (!isSupported.value)
      return false

    album.value = undefined
    artist.value = undefined
    artwork.value = undefined
    title.value = undefined
    navigator!.mediaSession.metadata = null

    duration.value = undefined
    playbackRate.value = undefined
    position.value = undefined
    navigator!.mediaSession.setPositionState()

    playbackState.value = 'none'
    navigator!.mediaSession.playbackState = 'none'

    cameraActive.value = false
    microphoneActive.value = false
    if (isSetCameraSupported.value)
      navigator!.mediaSession.setCameraActive(false)
    if (isSetMicrophoneSupported.value)
      navigator!.mediaSession.setMicrophoneActive(false)
  }

  // Clear MediaSession and unregister action handlers on dispose
  tryOnScopeDispose(() => {
    clear()
    for (const action of registeredActions.splice(0)) {
      try {
        navigator!.mediaSession.setActionHandler(action, null)
      }
      catch {}
    }
  })

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
    cameraActive,
    microphoneActive,
    isSetCameraSupported,
    isSetMicrophoneSupported,
    clear,
  }
}
