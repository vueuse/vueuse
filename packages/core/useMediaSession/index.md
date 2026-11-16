---
category: Browser
---

# useMediaSession

Reactive [Media Session API](https://developer.mozilla.org/en-US/docs/Web/API/Media_Session_API). The Media Session API provides a way to customize media notifications.

When supported, the session is initialized as soon as `useMediaSession()` is called,
without waiting for the component to mount.

::: warning
`useMediaSession` assumes it owns the page's media session. The Media Session API has no change events, so changes made to `navigator.mediaSession` outside of `useMediaSession` (e.g. by another player library) are not detected and may be overwritten on the next update. Use a single `useMediaSession` per page.
:::

## Basic Usage

```vue
<script setup lang="ts">
import { useMediaSession } from '@vueuse/core'
import { shallowRef, useTemplateRef } from 'vue'

const sampleVideo = useTemplateRef('sampleVideo')
const duration = shallowRef<number>()
const playbackRate = shallowRef<number>()
const position = shallowRef<number>()
const playbackState = shallowRef<MediaSessionPlaybackState>('none')

useMediaSession({
  title: 'Sintel',
  artist: 'Blender Foundation',
  album: 'Sintel',
  artwork: [
    { src: 'https://studio.blender.org/files/public/thumbnail/47/a9/47a954682dbd4f064da7e78ad6c2d32f044a3e85_m.webp', sizes: '640x360', type: 'image/webp' },
  ],
  duration,
  playbackRate,
  position,
  playbackState,
  onPlay: () => sampleVideo.value?.play(),
  onPause: () => sampleVideo.value?.pause(),
  onSeekBackward: details => sampleVideo.value.currentTime -= details.seekOffset ?? 10,
  onSeekForward: details => sampleVideo.value.currentTime += details.seekOffset ?? 10,
  onSeekTo: details => sampleVideo.value.currentTime = details.seekTime ?? 0,
})

function updatePositionState() {
  duration.value = sampleVideo.value?.duration
  playbackRate.value = sampleVideo.value?.playbackRate
  position.value = sampleVideo.value?.currentTime
}
</script>

<template>
  <video
    ref="sampleVideo"
    src="https://upload.wikimedia.org/wikipedia/commons/f/f1/Sintel_movie_4K.webm"
    controls
    @play="playbackState = 'playing'"
    @pause="playbackState = 'paused'"
    @loadedmetadata="updatePositionState()"
    @seeked="updatePositionState()"
  />
</template>
```

### Reactive state

Every state option (`title`, `artist`, `album`, `artwork`, `duration`, `playbackRate`, `position`, `playbackState`, `cameraActive`, `microphoneActive`) accepts a plain value, a ref or a getter. `useMediaSession` only reads them and publishes every change to the session:

```ts
import { useMediaSession } from '@vueuse/core'
import { computed, shallowRef } from 'vue'

const track = shallowRef({ title: 'Sintel', artist: 'Blender Foundation' })
const playing = shallowRef(false)

useMediaSession({
  title: () => track.value.title,
  artist: () => track.value.artist,
  playbackState: computed(() => playing.value ? 'playing' : 'paused'),
})
```

Left out, the metadata and position options are `undefined`, `playbackState` is `'none'` and `cameraActive` / `microphoneActive` are `false`.

## Action handlers

Pass `on*` options (`onPlay`, `onPause`, `onStop`, `onSeekBackward`, `onSeekForward`, `onSeekTo`, `onPreviousTrack`, `onNextTrack`, `onSkipAd`) to react to the device's media controls. Only the actions you pass a handler for are registered, so the browser shows only the matching controls. Actions the browser does not support are skipped.

Handlers are registered on setup and unregistered when the scope is disposed.

## Position state

Position updates are published once `duration` is defined. You can set `position`
and `playbackRate` before the media duration is available; their latest values are
used when `duration` is set. Setting `duration` back to `undefined` clears the
browser's position state.

## Clearing the session

The session is reset and all action handlers are unregistered when the scope is disposed. To clear the metadata or position state while the scope is active, set the corresponding sources to `undefined`.
