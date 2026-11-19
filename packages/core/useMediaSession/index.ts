import type { MaybeRefOrGetter } from 'vue'
import type { ConfigurableNavigator, Supportable } from '../types'
import type { UseSupportedReturn } from '../useSupported'
import { tryOnScopeDispose } from '@vueuse/shared'
import { effectScope, toValue, watch } from 'vue'
import { defaultNavigator } from '../_configurable'
import { useSupported } from '../useSupported'

/**
 * Many of the jsdoc definitions here are modified version of the
 * documentation from MDN(https://developer.mozilla.org/en-US/docs/Web/API/MediaSession)
 */

/**
 * State published to `navigator.mediaSession`. Every key accepts a plain value, a ref or a getter.
 */
export interface UseMediaSessionState {
  /**
   * Metadata of the media being played: `title`, `artist`, `album` and `artwork`.
   * `null` or `undefined` clears the metadata.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/MediaSession/metadata)
   *
   * @default undefined
   */
  metadata?: MaybeRefOrGetter<MediaMetadataInit | null | undefined>
  /**
   * Whether the media is playing or paused.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/MediaSession/playbackState)
   *
   * @default 'none'
   */
  playbackState?: MaybeRefOrGetter<MediaSessionPlaybackState>
  /**
   * Duration, playback position and playback rate of the media.
   * `null`, `undefined` or a state without `duration` clears the position state.
   * `position` must be between zero and `duration`.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/MediaSession/setPositionState)
   *
   * @default undefined
   */
  positionState?: MaybeRefOrGetter<MediaPositionState | null | undefined>
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
}

export interface UseMediaSessionOptions extends ConfigurableNavigator {
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
  /**
   * Stop syncing, reset the session and unregister the action handlers.
   * Called automatically when the current scope is disposed.
   */
  stop: () => void
}

/**
 * Reactive Media Session API.
 *
 * @param state State published to the session
 * @param options
 *
 * @see https://vueuse.org/useMediaSession
 */
export function useMediaSession(
  state: UseMediaSessionState = {},
  options: UseMediaSessionOptions = {},
): UseMediaSessionReturn {
  const { navigator = defaultNavigator } = options

  const isSupported = useSupported(() => navigator && 'mediaSession' in navigator)
  const isSetCameraSupported = useSupported(() => navigator && 'mediaSession' in navigator && 'setCameraActive' in navigator.mediaSession)
  const isSetMicrophoneSupported = useSupported(() => navigator && 'mediaSession' in navigator && 'setMicrophoneActive' in navigator.mediaSession)

  const scope = effectScope()

  const returnValue: UseMediaSessionReturn = {
    isSupported,
    isSetCameraSupported,
    isSetMicrophoneSupported,
    stop: () => scope.stop(),
  }

  if (!isSupported.value)
    return returnValue

  const mediaSession = navigator!.mediaSession

  scope.run(() => {
    watch(
      () => toValue(state.metadata),
      (metadata) => {
        const { album, artist, artwork, title } = metadata ?? {}
        mediaSession.metadata = [album, artist, artwork, title].every(value => value === undefined)
          ? null
          : new MediaMetadata({ album, artist, artwork, title })
      },
      // `deep` picks up in-place changes of reactive metadata, e.g. `artwork.push()`
      { immediate: true, deep: true },
    )

    watch(
      () => toValue(state.playbackState) ?? 'none',
      (playbackState) => {
        mediaSession.playbackState = playbackState
      },
      { immediate: true },
    )

    watch(
      () => toValue(state.positionState),
      (positionState) => {
        // A nonempty position state requires a duration, which may not be loaded yet.
        if (positionState?.duration === undefined)
          mediaSession.setPositionState()
        else
          mediaSession.setPositionState(positionState)
      },
      { immediate: true, deep: true },
    )

    if (isSetCameraSupported.value) {
      watch(
        () => toValue(state.cameraActive) ?? false,
        cameraActive => mediaSession.setCameraActive(cameraActive),
        { immediate: true },
      )
    }

    if (isSetMicrophoneSupported.value) {
      watch(
        () => toValue(state.microphoneActive) ?? false,
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

    // Reset the session on stop or scope dispose
    tryOnScopeDispose(() => {
      mediaSession.metadata = null
      mediaSession.setPositionState()
      mediaSession.playbackState = 'none'
      if (isSetCameraSupported.value)
        mediaSession.setCameraActive(false)
      if (isSetMicrophoneSupported.value)
        mediaSession.setMicrophoneActive(false)
    })
  })

  return returnValue
}
