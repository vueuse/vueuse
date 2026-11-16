---
category: Browser
---

# useMediaSession

Reactive [Media Session API](https://developer.mozilla.org/en-US/docs/Web/API/Media_Session_API). The Media Session API provides a way to customize media notifications.

When supported, the session is initialized as soon as `useMediaSession()` is called,
without waiting for the component to mount.

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
  initials: {
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
  },
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

### Initial values & owning the state

The returned refs are readonly. Before the first update, the metadata and position refs are `undefined`, `playbackState` is `'none'` and `cameraActive` / `microphoneActive` are `false`. Set static values with `initials`; they are published to the session on setup:

```ts
import { useMediaSession } from '@vueuse/core'

const { title, playbackState } = useMediaSession({
  initials: { title: 'Sintel', artist: 'Blender Foundation', playbackState: 'paused' },
})
```

To update the session later, pass your own refs to `initials`. `useMediaSession` uses them as its state and keeps the session in sync with them:

```ts
import { useMediaSession } from '@vueuse/core'
import { shallowRef } from 'vue'

const title = shallowRef('Sintel')

useMediaSession({ initials: { title } })

title.value = 'Big Buck Bunny' // published to the session
```

Don't pass a `computed` in `initials`: `clear()` writes into the passed refs.

## Action handlers

Pass `on*` options (`onPlay`, `onPause`, `onStop`, `onSeekBackward`, `onSeekForward`, `onSeekTo`, `onPreviousTrack`, `onNextTrack`, `onSkipAd`) to react to the device's media controls. Only the actions you pass a handler for are registered, so the browser shows only the matching controls. Actions the browser does not support are skipped.

Handlers are registered on setup and unregistered when the scope is disposed.

## Position state

Position updates are published once `duration` is defined. You can set `position`
and `playbackRate` before the media duration is available; their latest values are
used when `duration` is set. Setting `duration` back to `undefined` clears the
browser's position state.

## Clearing the session

Call `clear()` to reset metadata, playback state, position state, and camera/microphone
activity. Action handlers stay registered. The session is also cleared when its scope is disposed.
After calling `clear()`, you can update your refs to populate a new session.
