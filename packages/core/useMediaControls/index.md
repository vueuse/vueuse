---
category: Browser
---

# useMediaControls

Reactive media controls for both `audio` and `video` elements

## Usage

### Basic Usage
```html
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useMediaControls } from '@vueuse/core'

const video = ref()
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
  <button @click="playing = !playing">Play / Pause</button>
  <span>{{ currentTime }} / {{ duration }}</span>
</template>
```

### Providing Captions, Subtitles, etc...
You can provide captions, subtitles, etc in the `tracks` options of the
`useMediaControls` function. The function will return an array of tracks
along with two functions for controlling them, `enableTrack`, `disableTrack`, and `selectedTrack`.
Using these you can manage the currently selected track. `selectedTrack` will
be `-1` if there is no selected track.

```html

<script setup lang="ts">
import { useMediaControls } from '@vueuse/core'
import { ref } from 'vue'
  const video = ref()
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
