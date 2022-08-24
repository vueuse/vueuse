<script setup lang="ts">
import { ref } from 'vue-demi'

import { usePictureInPicture } from './'

const el = ref<HTMLVideoElement>()

const {
  isSupported,
  isInPictureInPictureMode,
  togglePictureInPicture,
} = usePictureInPicture(el)
</script>

<template>
  <video ref="el" controls="true" class="w-full">
    <source
      src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm"
      type="video/webm"
    >
    <source
      src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      type="video/mp4"
    >
    Sorry, your browser doesn't support embedded videos.
  </video>
  <br>
  <button
    v-if="isSupported"
    type="button"
    @click="togglePictureInPicture"
  >
    {{ isInPictureInPictureMode ? 'Exit' : 'Enter' }} Picture In Picture
  </button>

  <pre>
    Is Supported: {{ isSupported }}
    In Picture Mode: {{ isInPictureInPictureMode }}
  </pre>
</template>
