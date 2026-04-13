---
category: Browser
---

# useMediaControls

Reactive media controls for both `audio` and `video` elements

## Usage

### Basic Usage

```vue
<script setup lang="ts">
import { useMediaControls } from '@vueuse/core'
import { onMounted, useTemplateRef } from 'vue'

const video = useTemplateRef('video')
const { playing, currentTime, duration, volume } = useMediaControls(video, {
  src: 'video.mp4',
})

// Change initial media properties
onMounted(() => {
  volume.value = 0.5
  currentTime.value = 60
})
</script>

<template>
  <video ref="video" />
  <button @click="playing = !playing">
    Play / Pause
  </button>
  <span>{{ currentTime }} / {{ duration }}</span>
</template>
```

### Providing Captions, Subtitles, etc...

You can provide captions, subtitles, etc in the `tracks` options of the
`useMediaControls` function. The function will return an array of tracks
along with two functions for controlling them, `enableTrack`, `disableTrack`, and `selectedTrack`.
Using these you can manage the currently selected track. `selectedTrack` will
be `-1` if there is no selected track.

```vue
<script setup lang="ts">
import { useMediaControls } from '@vueuse/core'
import { useTemplateRef } from 'vue'

const video = useTemplateRef('video')
const {
  tracks,
  enableTrack
} = useMediaControls(video, {
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
  <button v-for="track in tracks" :key="track.id" @click="enableTrack(track)">
    {{ track.label }}
  </button>
</template>
```

## Type Declarations

```ts
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
  /**
   * Specifies the media query for the resource's intended media.
   */
  media?: string
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
  src?: MaybeRefOrGetter<string | UseMediaSource | UseMediaSource[]>
  /**
   * A list of text tracks for the media
   */
  tracks?: MaybeRefOrGetter<UseMediaTextTrackSource[]>
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
  options?: UseMediaControlsOptions,
): {
  currentTime: ShallowRef<number, number>
  duration: ShallowRef<number, number>
  waiting: ShallowRef<boolean, boolean>
  seeking: ShallowRef<boolean, boolean>
  ended: ShallowRef<boolean, boolean>
  stalled: ShallowRef<boolean, boolean>
  buffered: Ref<[number, number][], [number, number][]>
  playing: ShallowRef<boolean, boolean>
  rate: ShallowRef<number, number>
  volume: ShallowRef<number, number>
  muted: ShallowRef<boolean, boolean>
  tracks: Ref<
    {
      id: number
      label: string
      language: string
      mode: TextTrackMode
      kind: TextTrackKind
      inBandMetadataTrackDispatchType: string
      cues: {
        [x: number]: {
          endTime: number
          id: string
          onenter: ((this: TextTrackCue, ev: Event) => any) | null
          onexit: ((this: TextTrackCue, ev: Event) => any) | null
          pauseOnExit: boolean
          startTime: number
          readonly track: {
            readonly activeCues: /*elided*/ any | null
            readonly cues: /*elided*/ any | null
            readonly id: string
            readonly inBandMetadataTrackDispatchType: string
            readonly kind: TextTrackKind
            readonly label: string
            readonly language: string
            mode: TextTrackMode
            oncuechange: ((this: TextTrack, ev: Event) => any) | null
            addCue: (cue: TextTrackCue) => void
            removeCue: (cue: TextTrackCue) => void
            addEventListener: {
              <K extends keyof TextTrackEventMap>(
                type: K,
                listener: (this: TextTrack, ev: TextTrackEventMap[K]) => any,
                options?: boolean | AddEventListenerOptions,
              ): void
              (
                type: string,
                listener: EventListenerOrEventListenerObject,
                options?: boolean | AddEventListenerOptions,
              ): void
            }
            removeEventListener: {
              <K extends keyof TextTrackEventMap>(
                type: K,
                listener: (this: TextTrack, ev: TextTrackEventMap[K]) => any,
                options?: boolean | EventListenerOptions,
              ): void
              (
                type: string,
                listener: EventListenerOrEventListenerObject,
                options?: boolean | EventListenerOptions,
              ): void
            }
            dispatchEvent: {
              (event: Event): boolean
              (event: Event): boolean
            }
          } | null
          addEventListener: {
            <K extends keyof TextTrackCueEventMap>(
              type: K,
              listener: (
                this: TextTrackCue,
                ev: TextTrackCueEventMap[K],
              ) => any,
              options?: boolean | AddEventListenerOptions,
            ): void
            (
              type: string,
              listener: EventListenerOrEventListenerObject,
              options?: boolean | AddEventListenerOptions,
            ): void
          }
          removeEventListener: {
            <K extends keyof TextTrackCueEventMap>(
              type: K,
              listener: (
                this: TextTrackCue,
                ev: TextTrackCueEventMap[K],
              ) => any,
              options?: boolean | EventListenerOptions,
            ): void
            (
              type: string,
              listener: EventListenerOrEventListenerObject,
              options?: boolean | EventListenerOptions,
            ): void
          }
          dispatchEvent: {
            (event: Event): boolean
            (event: Event): boolean
          }
        }
        readonly length: number
        getCueById: (id: string) => TextTrackCue | null
        [Symbol.iterator]: () => ArrayIterator<TextTrackCue>
      } | null
      activeCues: {
        [x: number]: {
          endTime: number
          id: string
          onenter: ((this: TextTrackCue, ev: Event) => any) | null
          onexit: ((this: TextTrackCue, ev: Event) => any) | null
          pauseOnExit: boolean
          startTime: number
          readonly track: {
            readonly activeCues: /*elided*/ any | null
            readonly cues: /*elided*/ any | null
            readonly id: string
            readonly inBandMetadataTrackDispatchType: string
            readonly kind: TextTrackKind
            readonly label: string
            readonly language: string
            mode: TextTrackMode
            oncuechange: ((this: TextTrack, ev: Event) => any) | null
            addCue: (cue: TextTrackCue) => void
            removeCue: (cue: TextTrackCue) => void
            addEventListener: {
              <K extends keyof TextTrackEventMap>(
                type: K,
                listener: (this: TextTrack, ev: TextTrackEventMap[K]) => any,
                options?: boolean | AddEventListenerOptions,
              ): void
              (
                type: string,
                listener: EventListenerOrEventListenerObject,
                options?: boolean | AddEventListenerOptions,
              ): void
            }
            removeEventListener: {
              <K extends keyof TextTrackEventMap>(
                type: K,
                listener: (this: TextTrack, ev: TextTrackEventMap[K]) => any,
                options?: boolean | EventListenerOptions,
              ): void
              (
                type: string,
                listener: EventListenerOrEventListenerObject,
                options?: boolean | EventListenerOptions,
              ): void
            }
            dispatchEvent: {
              (event: Event): boolean
              (event: Event): boolean
            }
          } | null
          addEventListener: {
            <K extends keyof TextTrackCueEventMap>(
              type: K,
              listener: (
                this: TextTrackCue,
                ev: TextTrackCueEventMap[K],
              ) => any,
              options?: boolean | AddEventListenerOptions,
            ): void
            (
              type: string,
              listener: EventListenerOrEventListenerObject,
              options?: boolean | AddEventListenerOptions,
            ): void
          }
          removeEventListener: {
            <K extends keyof TextTrackCueEventMap>(
              type: K,
              listener: (
                this: TextTrackCue,
                ev: TextTrackCueEventMap[K],
              ) => any,
              options?: boolean | EventListenerOptions,
            ): void
            (
              type: string,
              listener: EventListenerOrEventListenerObject,
              options?: boolean | EventListenerOptions,
            ): void
          }
          dispatchEvent: {
            (event: Event): boolean
            (event: Event): boolean
          }
        }
        readonly length: number
        getCueById: (id: string) => TextTrackCue | null
        [Symbol.iterator]: () => ArrayIterator<TextTrackCue>
      } | null
    }[],
    | UseMediaTextTrack[]
    | {
        id: number
        label: string
        language: string
        mode: TextTrackMode
        kind: TextTrackKind
        inBandMetadataTrackDispatchType: string
        cues: {
          [x: number]: {
            endTime: number
            id: string
            onenter: ((this: TextTrackCue, ev: Event) => any) | null
            onexit: ((this: TextTrackCue, ev: Event) => any) | null
            pauseOnExit: boolean
            startTime: number
            readonly track: {
              readonly activeCues: /*elided*/ any | null
              readonly cues: /*elided*/ any | null
              readonly id: string
              readonly inBandMetadataTrackDispatchType: string
              readonly kind: TextTrackKind
              readonly label: string
              readonly language: string
              mode: TextTrackMode
              oncuechange: ((this: TextTrack, ev: Event) => any) | null
              addCue: (cue: TextTrackCue) => void
              removeCue: (cue: TextTrackCue) => void
              addEventListener: {
                <K extends keyof TextTrackEventMap>(
                  type: K,
                  listener: (this: TextTrack, ev: TextTrackEventMap[K]) => any,
                  options?: boolean | AddEventListenerOptions,
                ): void
                (
                  type: string,
                  listener: EventListenerOrEventListenerObject,
                  options?: boolean | AddEventListenerOptions,
                ): void
              }
              removeEventListener: {
                <K extends keyof TextTrackEventMap>(
                  type: K,
                  listener: (this: TextTrack, ev: TextTrackEventMap[K]) => any,
                  options?: boolean | EventListenerOptions,
                ): void
                (
                  type: string,
                  listener: EventListenerOrEventListenerObject,
                  options?: boolean | EventListenerOptions,
                ): void
              }
              dispatchEvent: {
                (event: Event): boolean
                (event: Event): boolean
              }
            } | null
            addEventListener: {
              <K extends keyof TextTrackCueEventMap>(
                type: K,
                listener: (
                  this: TextTrackCue,
                  ev: TextTrackCueEventMap[K],
                ) => any,
                options?: boolean | AddEventListenerOptions,
              ): void
              (
                type: string,
                listener: EventListenerOrEventListenerObject,
                options?: boolean | AddEventListenerOptions,
              ): void
            }
            removeEventListener: {
              <K extends keyof TextTrackCueEventMap>(
                type: K,
                listener: (
                  this: TextTrackCue,
                  ev: TextTrackCueEventMap[K],
                ) => any,
                options?: boolean | EventListenerOptions,
              ): void
              (
                type: string,
                listener: EventListenerOrEventListenerObject,
                options?: boolean | EventListenerOptions,
              ): void
            }
            dispatchEvent: {
              (event: Event): boolean
              (event: Event): boolean
            }
          }
          readonly length: number
          getCueById: (id: string) => TextTrackCue | null
          [Symbol.iterator]: () => ArrayIterator<TextTrackCue>
        } | null
        activeCues: {
          [x: number]: {
            endTime: number
            id: string
            onenter: ((this: TextTrackCue, ev: Event) => any) | null
            onexit: ((this: TextTrackCue, ev: Event) => any) | null
            pauseOnExit: boolean
            startTime: number
            readonly track: {
              readonly activeCues: /*elided*/ any | null
              readonly cues: /*elided*/ any | null
              readonly id: string
              readonly inBandMetadataTrackDispatchType: string
              readonly kind: TextTrackKind
              readonly label: string
              readonly language: string
              mode: TextTrackMode
              oncuechange: ((this: TextTrack, ev: Event) => any) | null
              addCue: (cue: TextTrackCue) => void
              removeCue: (cue: TextTrackCue) => void
              addEventListener: {
                <K extends keyof TextTrackEventMap>(
                  type: K,
                  listener: (this: TextTrack, ev: TextTrackEventMap[K]) => any,
                  options?: boolean | AddEventListenerOptions,
                ): void
                (
                  type: string,
                  listener: EventListenerOrEventListenerObject,
                  options?: boolean | AddEventListenerOptions,
                ): void
              }
              removeEventListener: {
                <K extends keyof TextTrackEventMap>(
                  type: K,
                  listener: (this: TextTrack, ev: TextTrackEventMap[K]) => any,
                  options?: boolean | EventListenerOptions,
                ): void
                (
                  type: string,
                  listener: EventListenerOrEventListenerObject,
                  options?: boolean | EventListenerOptions,
                ): void
              }
              dispatchEvent: {
                (event: Event): boolean
                (event: Event): boolean
              }
            } | null
            addEventListener: {
              <K extends keyof TextTrackCueEventMap>(
                type: K,
                listener: (
                  this: TextTrackCue,
                  ev: TextTrackCueEventMap[K],
                ) => any,
                options?: boolean | AddEventListenerOptions,
              ): void
              (
                type: string,
                listener: EventListenerOrEventListenerObject,
                options?: boolean | AddEventListenerOptions,
              ): void
            }
            removeEventListener: {
              <K extends keyof TextTrackCueEventMap>(
                type: K,
                listener: (
                  this: TextTrackCue,
                  ev: TextTrackCueEventMap[K],
                ) => any,
                options?: boolean | EventListenerOptions,
              ): void
              (
                type: string,
                listener: EventListenerOrEventListenerObject,
                options?: boolean | EventListenerOptions,
              ): void
            }
            dispatchEvent: {
              (event: Event): boolean
              (event: Event): boolean
            }
          }
          readonly length: number
          getCueById: (id: string) => TextTrackCue | null
          [Symbol.iterator]: () => ArrayIterator<TextTrackCue>
        } | null
      }[]
  >
  selectedTrack: ShallowRef<number, number>
  enableTrack: (
    track: number | UseMediaTextTrack,
    disableTracks?: boolean,
  ) => void
  disableTrack: (track?: number | UseMediaTextTrack) => void
  supportsPictureInPicture: boolean | undefined
  togglePictureInPicture: () => Promise<unknown>
  isPictureInPicture: ShallowRef<boolean, boolean>
  onSourceError: EventHookOn<Event>
  onPlaybackError: EventHookOn<Event>
}
export type UseMediaControlsReturn = ReturnType<typeof useMediaControls>
```
