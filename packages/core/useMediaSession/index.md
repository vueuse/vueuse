---
category: Browser
---

# useMediaSession

Reactive [Media Session API](https://developer.mozilla.org/en-US/docs/Web/API/Media_Session_API). The Media Session API provides a way to customize media notifications.

::: warning
`useMediaSession` assumes it owns the page's media session. The Media Session API has no change events, so changes made to `navigator.mediaSession` outside of `useMediaSession` (e.g. by another player library) are not detected and may be overwritten on the next update. Use a single `useMediaSession` per page.
:::

## Basic Usage

```vue
<script setup lang="ts">
import { useMediaSession } from '@vueuse/core'
import { shallowRef, useTemplateRef } from 'vue'

const sampleVideo = useTemplateRef('sampleVideo')
const playbackState = shallowRef<MediaSessionPlaybackState>('none')
const positionState = shallowRef<MediaPositionState>()

useMediaSession({
  metadata: {
    title: 'Sintel',
    artist: 'Blender Foundation',
    album: 'Sintel',
    artwork: [
      { src: 'https://studio.blender.org/files/public/thumbnail/47/a9/47a954682dbd4f064da7e78ad6c2d32f044a3e85_m.webp', sizes: '640x360', type: 'image/webp' },
    ],
  },
  playbackState,
  positionState,
}, {
  onPlay: () => sampleVideo.value?.play(),
  onPause: () => sampleVideo.value?.pause(),
  onSeekBackward: details => sampleVideo.value.currentTime -= details.seekOffset ?? 10,
  onSeekForward: details => sampleVideo.value.currentTime += details.seekOffset ?? 10,
  onSeekTo: details => sampleVideo.value.currentTime = details.seekTime ?? 0,
})

function updatePositionState() {
  const { duration, playbackRate, currentTime } = sampleVideo.value!
  positionState.value = { duration, playbackRate, position: currentTime }
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
    @ratechange="updatePositionState()"
  />
</template>
```

### Reactive state

The first argument mirrors `navigator.mediaSession`: `metadata`, `playbackState`, `positionState`, `cameraActive` and `microphoneActive`. Every key accepts a plain value, a ref or a getter, and each one is synced on its own, so toggling `playbackState` does not rebuild the metadata. `useMediaSession` only reads them and publishes every change to the session:

```ts
import { useMediaSession } from '@vueuse/core'
import { shallowRef } from 'vue'

const track = shallowRef({ title: 'Sintel', artist: 'Blender Foundation' })
const playing = shallowRef(false)

useMediaSession({
  metadata: track,
  playbackState: () => playing.value ? 'playing' : 'paused',
})
```

A `reactive` state object works as well. Left out, `metadata` and `positionState` are cleared, `playbackState` is `'none'` and `cameraActive` / `microphoneActive` are `false`.

## Action handlers

Pass `on*` options (`onPlay`, `onPause`, `onStop`, `onSeekBackward`, `onSeekForward`, `onSeekTo`, `onPreviousTrack`, `onNextTrack`, `onSkipAd`) to react to the device's media controls. Only the actions you pass a handler for are registered, so the browser shows only the matching controls. Actions the browser does not support are skipped.

Handlers are registered on setup and unregistered when the scope is disposed.

## Position state

`positionState` takes the same object as [`setPositionState()`](https://developer.mozilla.org/en-US/docs/Web/API/MediaSession/setPositionState): `duration`, `position` and `playbackRate`. Pass them together, so `position` never exceeds the `duration` of another track. The position state is published once `duration` is defined; `null`, `undefined` or a state without `duration` clears it.

Browsers extrapolate the position from `playbackRate`, so it only needs updating after seeking, after a rate change and when the media changes.

## Stopping the session

Call `stop()` to stop syncing, reset the session and unregister all action handlers. This happens automatically when the scope is disposed. To clear the metadata or position state while syncing, set them to `undefined`.

```ts
import { useMediaSession } from '@vueuse/core'

const { stop } = useMediaSession({ metadata: { title: 'Sintel' } })

stop()
```
