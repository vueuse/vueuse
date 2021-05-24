---
category: Browser
---

# useMediaControls

Reactive media controls for both `audio` and `video` elements

## Usage

### Basic Usage
```html
<script setup lang="ts">
import { ref } from 'vue'
import { useMediaControls } from '@vueuse/core'

const video = ref()
const { playing, currentTime, duration } = useMediaControls(video, { 
  src: 'video.mp4',
})
</script>

<template>
  <video ref="video" />
  <button @click="playing = !playing">Play / Pause</button>
  <span>{{ currentTime }} / {{ duration }}</span>
</template>
```

### Proving Captions, Subtitles, etc...
You can provide captions, subtitles, etc in the `tracks` options of the
`useMediaControls` function. The function will return an array of tracks
along with two functions for controlling them, `enableTrack`, `disableTrack`, and `selectedTrack`.
Using these you can manage the currently selected track. `selectedTrack` will
be `-1` if there is no selected track.

```html
<script setup lang="ts">
const { tracks, enableTrack } = useMediaControls(video, { 
  src: 'video.mp4',
  tracks: [
    {
      default: true,
      src: './subtitles.vtt',
      kind: 'subtitles',
      label: 'English',
      srcLang: 'en',
    },
  ]
})
</script>

<template>
  <video ref="video" />
  <button v-for="track in tacks" :key="track.id" @click="enableTrack(track)">
    {{ track.label }}
  </button>
</template>
```


<!--FOOTER_STARTS-->
## Type Declarations

```typescript
/**
 * Many of the jsdoc definitions here are modified version of the
 * documentation from MDN(https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement)
 */
export interface UseMediaSource {
  /**
   * The source url for the media
   */
  src: string
  /**
   * The media codec type
   */
  type?: string
}
export interface UseMediaTextTrackSource {
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
interface UseMediaControlsOptions extends ConfigurableDocument {
  /**
   * The source for the media, may either be a string, a `UseMediaSource` object, or a list
   * of `UseMediaSource` objects.
   */
  src?: MaybeRef<string | UseMediaSource | UseMediaSource[]>
  /**
   * A URL for an image to be shown while the media is downloading. If this attribute
   * isn't specified, nothing is displayed until the first frame is available,
   * then the first frame is shown as the poster frame.
   *
   * @deprecated Use `<video poster>` attribute instead
   */
  poster?: MaybeRef<string>
  /**
   * Indicates that the media automatically begins to play back as soon as it
   * can do so without stopping to finish loading the data.
   *
   * @default false
   * @deprecated Use `<video autoplay>` attribute instead
   */
  autoplay?: MaybeRef<boolean>
  /**
   * Indicates that the media is to be played "inline", that is within the
   * element's playback area. Note that the absence of this attribute does
   * not imply that the media will always be played in fullscreen.
   *
   * @default auto
   * @deprecated Use `<video preload>` attribute instead
   */
  preload?: MaybeRef<"auto" | "metadata" | "none">
  /**
   * If specified, the browser will automatically seek back to the start
   * upon reaching the end of the media.
   *
   * @default false
   * @deprecated Use `<video loop>` attribute instead
   */
  loop?: MaybeRef<boolean>
  /**
   * If true, the browser will offer controls to allow the user to control
   * media playback, including volume, seeking, and pause/resume playback.
   *
   * @default false
   * @deprecated Use `<video controls>` attribute instead
   */
  controls?: MaybeRef<boolean>
  /**
   * If true, the audio will be initially silenced. Its default value is false,
   * meaning that the audio will be played when the media is played.
   *
   * @default false
   * @deprecated Use `const { muted } = useMediaControls();` instead
   */
  muted?: MaybeRef<boolean>
  /**
   * Indicates that the video is to be played "inline", that is within the element's
   * playback area. Note that the absence of this attribute does not imply
   * that the video will always be played in fullscreen.
   *
   * @default false
   * @deprecated Use `<video playsinline>` attribute instead
   */
  playsinline?: MaybeRef<boolean>
  /**
   * A Boolean attribute which if true indicates that the element should automatically
   * toggle picture-in-picture mode when the user switches back and forth between
   * this document and another document or application.
   *
   * @default false
   * @deprecated Use `<video autopictureinpicture>` attribute instead
   */
  autoPictureInPicture?: MaybeRef<boolean>
  /**
   * A list of text tracks for the media
   */
  tracks?: MaybeRef<UseMediaTextTrackSource[]>
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
export declare function useMediaControls(
  target: MaybeRef<HTMLMediaElement | null | undefined>,
  options?: UseMediaControlsOptions
): {
  currentTime: Ref<number>
  duration: Ref<number>
  buffering: Ref<boolean>
  waiting: Ref<boolean>
  seeking: Ref<boolean>
  ended: Ref<boolean>
  stalled: Ref<boolean>
  buffered: Ref<[number, number][]>
  playing: Ref<boolean>
  volume: Ref<number>
  muted: Ref<boolean>
  tracks: Ref<
    {
      id: number
      label: string
      language: string
      mode: TextTrackMode
      kind: TextTrackKind
      inBandMetadataTrackDispatchType: string
      cues:
        | ({
            [x: number]: {
              endTime: number
              id: string
              onenter: ((this: TextTrackCue, ev: Event) => any) | null
              onexit: ((this: TextTrackCue, ev: Event) => any) | null
              pauseOnExit: boolean
              startTime: number
              readonly track: {
                readonly activeCues:
                  | (any & {
                      [Symbol.iterator]: () => IterableIterator<TextTrackCue>
                    })
                  | null
                readonly cues:
                  | (any & {
                      [Symbol.iterator]: () => IterableIterator<TextTrackCue>
                    })
                  | null
                readonly id: string
                readonly inBandMetadataTrackDispatchType: string
                readonly kind: TextTrackKind
                readonly label: string
                readonly language: string
                mode: TextTrackMode
                oncuechange: ((this: TextTrack, ev: Event) => any) | null
                readonly sourceBuffer: {
                  appendWindowEnd: number
                  appendWindowStart: number
                  readonly buffered: {
                    readonly length: number
                    end: (index: number) => number
                    start: (index: number) => number
                  }
                  mode: AppendMode
                  onabort: ((this: SourceBuffer, ev: Event) => any) | null
                  onerror: ((this: SourceBuffer, ev: Event) => any) | null
                  onupdate: ((this: SourceBuffer, ev: Event) => any) | null
                  onupdateend: ((this: SourceBuffer, ev: Event) => any) | null
                  onupdatestart: ((this: SourceBuffer, ev: Event) => any) | null
                  timestampOffset: number
                  readonly updating: boolean
                  abort: () => void
                  appendBuffer: (data: BufferSource) => void
                  remove: (start: number, end: number) => void
                  addEventListener: {
                    <K extends keyof SourceBufferEventMap>(
                      type: K,
                      listener: (
                        this: SourceBuffer,
                        ev: SourceBufferEventMap[K]
                      ) => any,
                      options?: boolean | AddEventListenerOptions | undefined
                    ): void
                    (
                      type: string,
                      listener: EventListenerOrEventListenerObject,
                      options?: boolean | AddEventListenerOptions | undefined
                    ): void
                  }
                  removeEventListener: {
                    <K_1 extends keyof SourceBufferEventMap>(
                      type: K_1,
                      listener: (
                        this: SourceBuffer,
                        ev: SourceBufferEventMap[K_1]
                      ) => any,
                      options?: boolean | EventListenerOptions | undefined
                    ): void
                    (
                      type: string,
                      listener: EventListenerOrEventListenerObject,
                      options?: boolean | EventListenerOptions | undefined
                    ): void
                  }
                  dispatchEvent: (event: Event) => boolean
                } | null
                addCue: (cue: TextTrackCue) => void
                removeCue: (cue: TextTrackCue) => void
                addEventListener: {
                  <K_2 extends "cuechange">(
                    type: K_2,
                    listener: (
                      this: TextTrack,
                      ev: TextTrackEventMap[K_2]
                    ) => any,
                    options?: boolean | AddEventListenerOptions | undefined
                  ): void
                  (
                    type: string,
                    listener: EventListenerOrEventListenerObject,
                    options?: boolean | AddEventListenerOptions | undefined
                  ): void
                }
                removeEventListener: {
                  <K_3 extends "cuechange">(
                    type: K_3,
                    listener: (
                      this: TextTrack,
                      ev: TextTrackEventMap[K_3]
                    ) => any,
                    options?: boolean | EventListenerOptions | undefined
                  ): void
                  (
                    type: string,
                    listener: EventListenerOrEventListenerObject,
                    options?: boolean | EventListenerOptions | undefined
                  ): void
                }
                dispatchEvent: (event: Event) => boolean
              } | null
              addEventListener: {
                <K_4 extends keyof TextTrackCueEventMap>(
                  type: K_4,
                  listener: (
                    this: TextTrackCue,
                    ev: TextTrackCueEventMap[K_4]
                  ) => any,
                  options?: boolean | AddEventListenerOptions | undefined
                ): void
                (
                  type: string,
                  listener: EventListenerOrEventListenerObject,
                  options?: boolean | AddEventListenerOptions | undefined
                ): void
              }
              removeEventListener: {
                <K_5 extends keyof TextTrackCueEventMap>(
                  type: K_5,
                  listener: (
                    this: TextTrackCue,
                    ev: TextTrackCueEventMap[K_5]
                  ) => any,
                  options?: boolean | EventListenerOptions | undefined
                ): void
                (
                  type: string,
                  listener: EventListenerOrEventListenerObject,
                  options?: boolean | EventListenerOptions | undefined
                ): void
              }
              dispatchEvent: (event: Event) => boolean
            }
            readonly length: number
            getCueById: (id: string) => TextTrackCue | null
          } & {
            [Symbol.iterator]: () => IterableIterator<TextTrackCue>
          })
        | null
      activeCues:
        | ({
            [x: number]: {
              endTime: number
              id: string
              onenter: ((this: TextTrackCue, ev: Event) => any) | null
              onexit: ((this: TextTrackCue, ev: Event) => any) | null
              pauseOnExit: boolean
              startTime: number
              readonly track: {
                readonly activeCues:
                  | (any & {
                      [Symbol.iterator]: () => IterableIterator<TextTrackCue>
                    })
                  | null
                readonly cues:
                  | (any & {
                      [Symbol.iterator]: () => IterableIterator<TextTrackCue>
                    })
                  | null
                readonly id: string
                readonly inBandMetadataTrackDispatchType: string
                readonly kind: TextTrackKind
                readonly label: string
                readonly language: string
                mode: TextTrackMode
                oncuechange: ((this: TextTrack, ev: Event) => any) | null
                readonly sourceBuffer: {
                  appendWindowEnd: number
                  appendWindowStart: number
                  readonly buffered: {
                    readonly length: number
                    end: (index: number) => number
                    start: (index: number) => number
                  }
                  mode: AppendMode
                  onabort: ((this: SourceBuffer, ev: Event) => any) | null
                  onerror: ((this: SourceBuffer, ev: Event) => any) | null
                  onupdate: ((this: SourceBuffer, ev: Event) => any) | null
                  onupdateend: ((this: SourceBuffer, ev: Event) => any) | null
                  onupdatestart: ((this: SourceBuffer, ev: Event) => any) | null
                  timestampOffset: number
                  readonly updating: boolean
                  abort: () => void
                  appendBuffer: (data: BufferSource) => void
                  remove: (start: number, end: number) => void
                  addEventListener: {
                    <K extends keyof SourceBufferEventMap>(
                      type: K,
                      listener: (
                        this: SourceBuffer,
                        ev: SourceBufferEventMap[K]
                      ) => any,
                      options?: boolean | AddEventListenerOptions | undefined
                    ): void
                    (
                      type: string,
                      listener: EventListenerOrEventListenerObject,
                      options?: boolean | AddEventListenerOptions | undefined
                    ): void
                  }
                  removeEventListener: {
                    <K_1 extends keyof SourceBufferEventMap>(
                      type: K_1,
                      listener: (
                        this: SourceBuffer,
                        ev: SourceBufferEventMap[K_1]
                      ) => any,
                      options?: boolean | EventListenerOptions | undefined
                    ): void
                    (
                      type: string,
                      listener: EventListenerOrEventListenerObject,
                      options?: boolean | EventListenerOptions | undefined
                    ): void
                  }
                  dispatchEvent: (event: Event) => boolean
                } | null
                addCue: (cue: TextTrackCue) => void
                removeCue: (cue: TextTrackCue) => void
                addEventListener: {
                  <K_2 extends "cuechange">(
                    type: K_2,
                    listener: (
                      this: TextTrack,
                      ev: TextTrackEventMap[K_2]
                    ) => any,
                    options?: boolean | AddEventListenerOptions | undefined
                  ): void
                  (
                    type: string,
                    listener: EventListenerOrEventListenerObject,
                    options?: boolean | AddEventListenerOptions | undefined
                  ): void
                }
                removeEventListener: {
                  <K_3 extends "cuechange">(
                    type: K_3,
                    listener: (
                      this: TextTrack,
                      ev: TextTrackEventMap[K_3]
                    ) => any,
                    options?: boolean | EventListenerOptions | undefined
                  ): void
                  (
                    type: string,
                    listener: EventListenerOrEventListenerObject,
                    options?: boolean | EventListenerOptions | undefined
                  ): void
                }
                dispatchEvent: (event: Event) => boolean
              } | null
              addEventListener: {
                <K_4 extends keyof TextTrackCueEventMap>(
                  type: K_4,
                  listener: (
                    this: TextTrackCue,
                    ev: TextTrackCueEventMap[K_4]
                  ) => any,
                  options?: boolean | AddEventListenerOptions | undefined
                ): void
                (
                  type: string,
                  listener: EventListenerOrEventListenerObject,
                  options?: boolean | AddEventListenerOptions | undefined
                ): void
              }
              removeEventListener: {
                <K_5 extends keyof TextTrackCueEventMap>(
                  type: K_5,
                  listener: (
                    this: TextTrackCue,
                    ev: TextTrackCueEventMap[K_5]
                  ) => any,
                  options?: boolean | EventListenerOptions | undefined
                ): void
                (
                  type: string,
                  listener: EventListenerOrEventListenerObject,
                  options?: boolean | EventListenerOptions | undefined
                ): void
              }
              dispatchEvent: (event: Event) => boolean
            }
            readonly length: number
            getCueById: (id: string) => TextTrackCue | null
          } & {
            [Symbol.iterator]: () => IterableIterator<TextTrackCue>
          })
        | null
    }[]
  >
  selectedTrack: Ref<number>
  enableTrack: (
    track: number | UseMediaTextTrack,
    disableTracks?: boolean
  ) => void
  disableTrack: (track?: number | UseMediaTextTrack | undefined) => void
  supportsPictureInPicture: boolean | undefined
  togglePictureInPicture: () => Promise<unknown>
  isPictureInPicture: Ref<boolean>
  onSourceError: EventHookOn<Event>
}
export {}
```

## Source

[Source](https://github.com/vueuse/vueuse/blob/main/packages/core/useMediaControls/index.ts) • [Demo](https://github.com/vueuse/vueuse/blob/main/packages/core/useMediaControls/demo.vue) • [Docs](https://github.com/vueuse/vueuse/blob/main/packages/core/useMediaControls/index.md)


<!--FOOTER_ENDS-->
