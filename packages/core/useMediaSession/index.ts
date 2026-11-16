import type { MaybeRefOrGetter } from 'vue'
import type { ConfigurableNavigator, Supportable } from '../types'
import type { UseSupportedReturn } from '../useSupported'
import { tryOnScopeDispose } from '@vueuse/shared'
import { toValue, watch } from 'vue'
import { defaultNavigator } from '../_configurable'
import { useSupported } from '../useSupported'

/**
 * Many of the jsdoc definitions here are modified version of the
 * documentation from MDN(https://developer.mozilla.org/en-US/docs/Web/API/MediaSession)
 */

export interface UseMediaSessionOptions extends ConfigurableNavigator {
  /**
   * The **`album`** property of the `MediaMetadata` interface returns or sets the name of the album or collection containing the media to be played.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/MediaMetadata/album)
   *
   * @default undefined
   */
  album?: MaybeRefOrGetter<MediaMetadataInit['album']>
  /**
   * The **`artist`** property of the `MediaMetadata` interface returns or sets the name of the artist, group, creator, etc., of the media to be played.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/MediaMetadata/artist)
   *
   * @default undefined
   */
  artist?: MaybeRefOrGetter<MediaMetadataInit['artist']>
  /**
   * The **`artwork`** property of the `MediaMetadata` interface returns or sets an array of objects representing images associated with playing media.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/MediaMetadata/artwork)
   *
   * @default undefined
   */
  artwork?: MaybeRefOrGetter<MediaMetadataInit['artwork']>
  /**
   * The **`title`** property of the `MediaMetadata` interface returns or sets the title of the media to be played.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/MediaMetadata/title)
   *
   * @default undefined
   */
  title?: MaybeRefOrGetter<MediaMetadataInit['title']>
  /**
   * A floating-point value giving the total duration of the current media in seconds.
   * This should always be a non-negative number, with positive infinity (`Infinity`) indicating media
   * without a defined end, such as a live stream.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/MediaSession/setPositionState#duration)
   *
   * @default undefined
   */
  duration?: MaybeRefOrGetter<MediaPositionState['duration']>
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
  playbackRate?: MaybeRefOrGetter<MediaPositionState['playbackRate']>
  /**
   * A floating-point value indicating the last reported playback position of the media in seconds. This must be between zero and the duration, inclusive.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/MediaSession/setPositionState#position)
   *
   * @default undefined
   */
  position?: MaybeRefOrGetter<MediaPositionState['position']>
  /**
   * The **`playbackState`** property of the `MediaSession` interface indicates whether the current media session is playing or paused.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/MediaSession/playbackState)
   *
   * @default 'none'
   */
  playbackState?: MaybeRefOrGetter<MediaSessionPlaybackState>
  /**
   * Indicate to the user agent whether the user's camera is considered to be active.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/MediaSession/setCameraActive)
   *
   * @default false
   */
  cameraActive?: MaybeRefOrGetter<boolean>
  /**
   * Indicate to the user agent whether the user's microphone is considered to be active.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/MediaSession/setMicrophoneActive)
   *
   * @default false
   */
  microphoneActive?: MaybeRefOrGetter<boolean>
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

export interface UseMediaSessionReturn extends Supportable {
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
}

/**
 * Reactive Media Session API.
 *
 * @see https://vueuse.org/useMediaSession
 */
export function useMediaSession(options: UseMediaSessionOptions = {}): UseMediaSessionReturn {
  const {
    navigator = defaultNavigator,
    album,
    artist,
    artwork,
    title,
    duration,
    playbackRate,
    position,
    playbackState = 'none',
    cameraActive = false,
    microphoneActive = false,
  } = options

  const isSupported = useSupported(() => navigator && 'mediaSession' in navigator)
  const isSetCameraSupported = useSupported(() => navigator && 'mediaSession' in navigator && 'setCameraActive' in navigator.mediaSession)
  const isSetMicrophoneSupported = useSupported(() => navigator && 'mediaSession' in navigator && 'setMicrophoneActive' in navigator.mediaSession)

  const returnValue: UseMediaSessionReturn = {
    isSupported,
    isSetCameraSupported,
    isSetMicrophoneSupported,
  }

  if (!isSupported.value)
    return returnValue

  const mediaSession = navigator!.mediaSession

  watch(
    [() => toValue(album), () => toValue(artist), () => toValue(artwork), () => toValue(title)],
    ([album, artist, artwork, title]) => {
      const metadata: MediaMetadataInit = { album, artist, artwork, title }
      mediaSession.metadata = Object.values(metadata).every(value => value === undefined)
        ? null
        : new MediaMetadata(metadata)
    },
    // `deep` picks up in-place changes of a reactive `artwork` array
    { immediate: true, deep: true },
  )

  watch(
    () => toValue(playbackState),
    (playbackState) => {
      mediaSession.playbackState = playbackState
    },
    { immediate: true },
  )

  // A nonempty position state requires a duration, which may not be loaded yet.
  // Clear any position state left on the session until the duration is available.
  if (toValue(duration) === undefined)
    mediaSession.setPositionState()

  watch(
    [() => toValue(duration), () => toValue(playbackRate), () => toValue(position)],
    ([duration, playbackRate, position], [previousDuration]) => {
      if (duration === undefined) {
        // Only clear when the duration is unset, not on every change while waiting for it
        if (previousDuration !== undefined)
          mediaSession.setPositionState()
        return
      }
      mediaSession.setPositionState({ duration, playbackRate, position })
    },
    { immediate: true },
  )

  if (isSetCameraSupported.value) {
    watch(
      () => toValue(cameraActive),
      cameraActive => mediaSession.setCameraActive(cameraActive),
      { immediate: true },
    )
  }

  if (isSetMicrophoneSupported.value) {
    watch(
      () => toValue(microphoneActive),
      microphoneActive => mediaSession.setMicrophoneActive(microphoneActive),
      { immediate: true },
    )
  }

  for (const [action, option] of Object.entries(actionOptions) as [MediaSessionAction, keyof typeof options][]) {
    const handler = options[option] as MediaSessionActionHandler | undefined
    if (!handler)
      continue
    try {
      mediaSession.setActionHandler(action, handler)
    }
    // The browser throws for actions it does not support
    catch {
      continue
    }
    tryOnScopeDispose(() => mediaSession.setActionHandler(action, null))
  }

  // Reset the session on dispose
  tryOnScopeDispose(() => {
    mediaSession.metadata = null
    mediaSession.setPositionState()
    mediaSession.playbackState = 'none'
    if (isSetCameraSupported.value)
      mediaSession.setCameraActive(false)
    if (isSetMicrophoneSupported.value)
      mediaSession.setMicrophoneActive(false)
  })

  return returnValue
}
