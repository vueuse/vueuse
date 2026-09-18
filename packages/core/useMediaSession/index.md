---
category: Browser
---

# useMediaSession

Reactive [Media Session API](https://developer.mozilla.org/en-US/docs/Web/API/Media_Session_API). The Media Session API provides a way to customize media notifications.

## Basic Usage

```vue
<script setup lang="ts">
import { useMediaSession } from '@vueuse/core'

const sampleVideo = useTemplateRef('sampleVideo')

const { metadata, positionState, playbackState, actionHandlers } = useMediaSession()
metadata.value = {
  title: 'Sintel',
  artist: 'Blender Foundation',
  album: 'Sintel',
  artwork: [
    { src: 'https://studio.blender.org/files/public/thumbnail/47/a9/47a954682dbd4f064da7e78ad6c2d32f044a3e85_m.webp', sizes: '640x360', type: 'image/webp' },
  ],
}

actionHandlers.value = {
  play: () => sampleVideo.value?.play(),
  pause: () => sampleVideo.value?.pause(),
  seekbackward: details => sampleVideo.value.currentTime -= details.seekOffset ?? 10,
  seekforward: details => sampleVideo.value.currentTime += details.seekOffset ?? 10,
  seekto: details => sampleVideo.value.currentTime = details.seekTime ?? 0,
}

watchEffect(() => {
  positionState.value = {
    duration: sampleVideo.value?.duration,
    playbackRate: sampleVideo.value?.playbackRate,
    position: sampleVideo.value?.currentTime,
  }
})
</script>

<template>
  <video
    ref="sampleVideo"
    src="https://upload.wikimedia.org/wikipedia/commons/f/f1/Sintel_movie_4K.webm"
    controls
    @play="playbackState = 'playing'"
    @pause="playbackState = 'paused'"
  />
</template>
```
