<script setup lang="ts">
import { useMediaControls, useMediaSession } from '@vueuse/core'
import { computed, shallowRef, useTemplateRef, watchEffect } from 'vue'
import Menu from '../useMediaControls/components/Menu.vue'
import MenuItem from '../useMediaControls/components/MenuItem.vue'
import Scrubber from '../useMediaControls/components/Scrubber.vue'
import Spinner from '../useMediaControls/components/Spinner.vue'

const video = useTemplateRef('video')
const loop = shallowRef(false)
const poster = 'https://cdn.bitmovin.com/content/assets/sintel/poster.png'

const controls = useMediaControls(video, {
  src: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Sintel_movie_4K.webm',
    type: 'video/webm',
  },
})

const { playing, buffered, currentTime, duration, rate, waiting } = controls
const endBuffer = computed(() => buffered.value.length > 0 ? buffered.value[buffered.value.length - 1][1] : 0)
function formatDuration(seconds: number) {
  return new Date(1000 * seconds).toISOString().slice(14, 19)
}

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
  play: () => playing.value = true,
  pause: () => playing.value = false,
  seekbackward: details => currentTime.value -= details.seekOffset ?? 10,
  seekforward: details => currentTime.value += details.seekOffset ?? 10,
  seekto: details => currentTime.value = details.seekTime ?? 0,
}

watchEffect(() => {
  positionState.value = {
    duration: duration.value,
    playbackRate: rate.value,
    position: currentTime.value,
  }
})

watchEffect(() => {
  playbackState.value = playing.value ? 'playing' : 'paused'
})
</script>

<template>
  <div
    class="outline-none"
    :tabindex="0"
    autofocus
    @keydown.prevent.space="playing = !playing"
    @keydown.right="currentTime += 10"
    @keydown.left="currentTime -= 10"
  >
    <div class="mt-5 relative bg-black rounded-md shadow overflow-hidden">
      <video
        ref="video"
        crossorigin="anonymous"
        class="w-full block"
        :poster="poster"
        :loop="loop"
        @click="playing = !playing"
      />
      <div
        v-if="waiting"
        class="absolute inset-0 grid place-items-center pointer-events-none bg-black bg-opacity-20"
      >
        <Spinner />
      </div>
    </div>

    <Scrubber v-model="currentTime" :max="duration" :secondary="endBuffer" class="mt-2">
      <template #default="{ position, pendingValue }">
        <div
          class="absolute transform -translate-x-1/2 bg-black rounded px-2 bottom-0 mb-4 py-1 text-xs text-white"
          :style="{ left: position }"
        >
          {{ formatDuration(pendingValue) }}
        </div>
      </template>
    </Scrubber>

    <div class="flex flex-row items-center gap-2">
      <button @click="playing = !playing">
        <i v-if="!playing" inline-block align-middle i-carbon-play />
        <i v-else i-carbon-pause inline-block align-middle />
      </button>
      <Menu>
        <template #default="{ open }">
          <button class="block" @click="open()">
            <i i-carbon-meter inline-block align-middle />
          </button>
        </template>
        <template #menu="{ close }">
          <div class="absolute bottom-0 right-0 shadow py-2 bg-black rounded">
            <MenuItem @click="() => { rate = 2; close(); }">
              <i i-carbon-meter-alt />2x
            </MenuItem>
            <MenuItem @click="() => { rate = 1; close(); }">
              <i i-carbon-meter-alt />1x
            </MenuItem>
          </div>
        </template>
      </Menu>
      <div class="flex flex-col flex-1 text-sm">
        {{ formatDuration(currentTime) }} / {{ formatDuration(duration) }}
      </div>
    </div>
  </div>
</template>
