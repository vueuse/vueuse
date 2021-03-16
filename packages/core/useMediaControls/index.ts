import { watch, ref, unref } from 'vue-demi'
import { isObject, MaybeRef, isString, ignorableWatch, isNumber } from '@vueuse/shared'
import { useEventListener } from '../useEventListener'

interface UseMediaSource {
  /**
   * The source url for the media
   */
  src: string

  /**
   * The media codec type
   */
  type?: string
}

interface UseMediaTextTrackSource {
  /**
   * Indicates that the track should be enabled unless the user's preferences indicate
   * that another track is more appropriate
   */
  default?: boolean

  /**
   * How the text track is meant to be used. If omitted the default kind is subtitles.
   */
  kind: TextTrackKind

  /**
   * A user-readable title of the text track which is used by the browser
   * when listing available text tracks.
   */
  label: string

  /**
   * Address of the track (.vtt file). Must be a valid URL. This attribute
   * must be specified and its URL value must have the same origin as the document
   */
  src: string

  /**
   * Language of the track text data. It must be a valid BCP 47 language tag.
   * If the kind attribute is set to subtitles, then srclang must be defined.
   */
  srcLang: string
}

interface UseMediaControlsOptions {
  /**
   * The source for the media, may either be a string, a `UseMediaSource` object, or a list
   * of `UseMediaSource` objects.
   */
  src: MaybeRef<string | UseMediaSource | UseMediaSource[]>

  /**
   * A URL for an image to be shown while the media is downloading. If this attribute
   * isn't specified, nothing is displayed until the first frame is available,
   * then the first frame is shown as the poster frame.
   */
  poster: MaybeRef<string>

  /**
   * Indicates that the media automatically begins to play back as soon as it
   * can do so without stopping to finish loading the data.
   *
   * @default false
   */
  autoplay: MaybeRef<boolean>

  /**
   * Indicates that the media is to be played "inline", that is within the
   * element's playback area. Note that the absence of this attribute does
   * not imply that the media will always be played in fullscreen.
   *
   * @default auto
   */
  preload: MaybeRef<'auto' | 'metadata' | 'none' >

  /**
   * If specified, the browser will automatically seek back to the start
   * upon reaching the end of the media.
   *
   * @default false
   */
  loop: MaybeRef<boolean>

  /**
   * If true, the browser will offer controls to allow the user to control
   * media playback, including volume, seeking, and pause/resume playback.
   *
   * @default false
   */
  controls: MaybeRef<boolean>

  /**
   * If true, the audio will be initially silenced. Its default value is false,
   * meaning that the audio will be played when the media is played.
   *
   * @default false
   */
  muted: MaybeRef<boolean>

  /**
   * Indicates that the video is to be played "inline", that is within the element's
   * playback area. Note that the absence of this attribute does not imply
   * that the video will always be played in fullscreen.
   *
   * @default false
   */
  playsinline: MaybeRef<boolean>

  /**
   * A Boolean attribute which if true indicates that the element should automatically
   * toggle picture-in-picture mode when the user switches back and forth between
   * this document and another document or application.
   *
   * @default false
   */
  autoPictureInPicture: MaybeRef<boolean>

  /**
   * A list of text tracks for the media
   */
  tracks: MaybeRef<UseMediaTextTrackSource[]>
}

export interface UseMediaTextTrack {
  /**
   * The index of the text track
   */
  id: number

  /**
   * The text track label
   */
  label: string

  /**
   * Language of the track text data. It must be a valid BCP 47 language tag.
   * If the kind attribute is set to subtitles, then srclang must be defined.
   */
  language: string

  /**
   * Specifies the display mode of the text track, either `disabled`,
   * `hidden`, or `showing`
   */
  mode: TextTrackMode

  /**
   * How the text track is meant to be used. If omitted the default kind is subtitles.
   */
  kind: TextTrackKind

  /**
   * Indicates the track's in-band metadata track dispatch type.
   */
  inBandMetadataTrackDispatchType: string

  /**
   * A list of text track cues
   */
  cues: TextTrackCueList | null

  /**
   * A list of active text track cues
   */
  activeCues: TextTrackCueList | null
}

/**
 * Automatically check if the ref exists and if it does run the cb fn
 */
function usingElRef<T = any>(source: MaybeRef<any>, cb: (el: T) => void) {
  if (unref(source))
    cb(unref(source))
}

/**
 * Converts a TimeRange object to an array
 */
function timeRangeToArray(timeRanges: TimeRanges) {
  let ranges: [number, number][] = []

  for (let i = 0; i < timeRanges.length; ++i)
    ranges = [...ranges, [timeRanges.start(i), timeRanges.end(i)]]

  return ranges
}

/**
 * Converts a TextTrackList object to an array of `UseMediaTextTrack`
 */
function tracksToArray(tracks: TextTrackList): UseMediaTextTrack[] {
  return Array.from(tracks)
    .map(({ label, kind, language, mode, activeCues, cues, inBandMetadataTrackDispatchType }, id) =>
      ({ id, label, kind, language, mode, activeCues, cues, inBandMetadataTrackDispatchType }))
}

const defaultOptions: UseMediaControlsOptions = {
  src: '',
  poster: '',
  autoplay: false,
  preload: 'auto',
  loop: false,
  controls: false,
  muted: false,
  playsinline: false,
  autoPictureInPicture: false,
  tracks: [],
}

export function useMediaControls(target: MaybeRef<HTMLMediaElement | null | undefined>, options: Partial<UseMediaControlsOptions>) {
  options = { ...defaultOptions, ...options }

  const currentTime = ref(0)
  const duration = ref(0)
  const seeking = ref(false)
  const buffering = ref(false)
  const volume = ref(1)
  const waiting = ref(false)
  const ended = ref(false)
  const playing = ref(false)
  const rate = ref(1)
  const stalled = ref(false)
  const buffered = ref<[number, number][]>([])
  const tracks = ref<UseMediaTextTrack[]>([])
  const selectedTrack = ref<number>(-1)
  const isPictureInPicture = ref(false)

  const supportsPictureInPicture = 'pictureInPictureEnabled' in document

  /**
   * Enables the specified track and disables the
   * other tracks unless otherwise specified
   *
   * @param track The track of the id of the track to enable
   * @param disableTracks Disable all other tracks
   */
  const enableTrack = (track: number | UseMediaTextTrack, disableTracks = true) => {
    usingElRef<HTMLMediaElement>(target, (el) => {
      const id = isNumber(track) ? track : track.id

      if (disableTracks)
        disableTrack()

      el.textTracks[id].mode = 'showing'
      selectedTrack.value = id
    })
  }

  /**
   * Disables the specified track. If no track is specified then
   * all tracks will be disabled
   *
   * @param track The id of the track to disable
   */
  const disableTrack = (track?: number | UseMediaTextTrack) => {
    usingElRef<HTMLMediaElement>(target, (el) => {
      if (track) {
        const id = isNumber(track) ? track : track.id
        el.textTracks[id].mode = 'disabled'
      }
      else {
        for (let i = 0; i < el.textTracks.length; ++i)
          el.textTracks[i].mode = 'disabled'
      }

      selectedTrack.value = -1
    })
  }

  /**
   * Toggle picture in picture mode for the player.
   */
  const togglePictureInPicture = () => {
    return new Promise((resolve, reject) => {
      usingElRef<HTMLVideoElement>(target, async(el) => {
        if (supportsPictureInPicture) {
          if (!isPictureInPicture.value) {
            (el as any).requestPictureInPicture()
              .then(resolve)
              .catch(reject)
          }
          else {
            (document as any).exitPictureInPicture()
              .then(resolve)
              .catch(reject)
          }
        }
      })
    })
  }

  const stop = watch([target], () => {
    usingElRef<HTMLMediaElement>(target, (el) => {
      stop()

      // Apply Options
      watch(
        () => [
          unref(options.loop),
          unref(options.controls),
          unref(options.muted),
          unref(options.preload),
          unref(options.autoplay),
          unref(options.playsinline),
        ],
        () => {
          (el as HTMLVideoElement).playsInline = unref(options.playsinline)!
          el.loop = unref(options.loop)!
          el.controls = unref(options.controls)!
          el.muted = unref(options.muted)!
          el.preload = unref(options.preload)!
          el.autoplay = unref(options.autoplay)!
        },
        { deep: true, immediate: true },
      )

      /**
       * Watch volume and change player volume when volume prop changes
       */
      watch(volume, vol => el.volume = vol)

      /**
       * Watch for poster changes so we can update the media player poster.
       */
      watch(
        () => [unref(options.poster)],
        () => (el as HTMLVideoElement).poster = unref(options.poster) || '',
        { deep: true, immediate: true },
      )

      /**
       * This will automatically inject sources to the media element. The sources will be
       * appended as children to the media element as `<source>` elements.
       */
      watch(
        () => [unref(options.src)],
        () => {
          const src = unref(options.src)
          let sources: UseMediaSource[] = []

          if (!src)
            return

          // Merge sources into an array
          if (isString(src))
            sources = [{ src }]
          else if (Array.isArray(src))
            sources = src
          else if (isObject(src))
            sources = [src]

          // Clear the sources
          el.querySelectorAll('source').forEach(e => e.remove())

          // Add new sources
          sources.forEach(({ src, type }) => {
            const source = document.createElement('source')

            source.setAttribute('src', src)
            source.setAttribute('type', type || '')

            el.appendChild(source)
          })

          // Finally, load the new sources.
          el.load()
        },
        { deep: true, immediate: true },
      )

      /**
       * Load Tracks
       */
      watch(
        () => [unref(options.tracks)],
        () => {
          const textTracks = unref(options.tracks)

          if (!textTracks)
            return

          /**
           * The MediaAPI provides an API for adding text tracks, but they don't currently
           * have an API for removing text tracks, so instead we will just create and remove
           * the tracks manually using the HTML api.
           */
          el.querySelectorAll('track').forEach(e => e.remove())

          textTracks.forEach(({ default: isDefault, kind, label, src, srcLang }, i) => {
            const track = document.createElement('track')

            track.default = isDefault || false
            track.kind = kind
            track.label = label
            track.src = src
            track.srclang = srcLang

            if (track.default)
              selectedTrack.value = i

            el.appendChild(track)
          })
        },
        { deep: true, immediate: true },
      )

      /**
         * This will allow us to update the current time from the timeupdate event
         * without setting the medias current position, but if the user changes the
         * current time via the ref, then the media will seek.
         *
         * If we did not use an ignorable watch, then the current time update from
         * the timeupdate event would cause the media to stutter.
         */
      const { ignoreUpdates: ignoreCurrentTimeUpdates } = ignorableWatch(currentTime, (time) => {
        el.currentTime = time
      })

      /**
       * Using an ignorable watch so we can control the play state using a ref and not
       * a function
       */
      const { ignoreUpdates: ignorePlayingUpdates } = ignorableWatch(playing, (isPlaying) => {
        isPlaying ? el.play() : el.pause()
      })

      /**
       * Attach event listeners
       */
      useEventListener(el, 'timeupdate', () => ignoreCurrentTimeUpdates(() => currentTime.value = el.currentTime))
      useEventListener(el, 'durationchange', () => duration.value = el.duration)
      useEventListener(el, 'progress', () => buffered.value = timeRangeToArray(el.buffered))
      useEventListener(el, 'seeking', () => seeking.value = true)
      useEventListener(el, 'seeked', () => seeking.value = false)
      useEventListener(el, 'waiting', () => waiting.value = true)
      useEventListener(el, 'playing', () => waiting.value = false)
      useEventListener(el, 'ratechange', () => rate.value = el.playbackRate)
      useEventListener(el, 'stalled', () => stalled.value = true)
      useEventListener(el, 'ended', () => ended.value = true)
      useEventListener(el, 'pause', () => ignorePlayingUpdates(() => playing.value = false))
      useEventListener(el, 'play', () => ignorePlayingUpdates(() => playing.value = true))
      useEventListener(el.textTracks, 'addtrack', () => tracks.value = tracksToArray(el.textTracks))
      useEventListener(el.textTracks, 'removetrack', () => tracks.value = tracksToArray(el.textTracks))
      useEventListener(el.textTracks, 'change', () => tracks.value = tracksToArray(el.textTracks))
      useEventListener(el, 'enterpictureinpicture', () => isPictureInPicture.value = true)
      useEventListener(el, 'leavepictureinpicture', () => isPictureInPicture.value = false)
    })
  }, { immediate: true })

  return {
    currentTime,
    duration,
    buffering,
    waiting,
    seeking,
    ended,
    stalled,
    buffered,
    playing,
    volume,

    // Tracks
    tracks,
    selectedTrack,
    enableTrack,
    disableTrack,

    // Picture in Picture
    supportsPictureInPicture,
    togglePictureInPicture,
    isPictureInPicture,
  }
}
