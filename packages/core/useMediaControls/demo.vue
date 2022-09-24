<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { stringify } from '@vueuse/docs-utils'
import { useMediaControls } from '@vueuse/core'
import Scrubber from './components/Scrubber.vue'
import Menu from './components/Menu.vue'
import MenuItem from './components/MenuItem.vue'
import Spinner from './components/Spinner.vue'

const video = ref<HTMLVideoElement>()
const loop = ref(false)
const poster = 'https://bitmovin.com/wp-content/uploads/2016/06/sintel-poster.jpg'

const controls = useMediaControls(video, {
  src: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/f/f1/Sintel_movie_4K.webm/Sintel_movie_4K.webm.1080p.vp9.webm',
    type: 'video/webm',
  },
  tracks: [
    {
      default: true,
      src: 'https://gist.githubusercontent.com/wheatjs/a85a65a82d87d7c098e1a0972ef1f726/raw',
      kind: 'subtitles',
      label: 'English',
      srcLang: 'en',
    },
    {
      src: 'https://gist.githubusercontent.com/wheatjs/38f32925d20c683bf77ba33ff737891b/raw',
      kind: 'subtitles',
      label: 'French',
      srcLang: 'fr',
    },
  ],
})

const {
  playing,
  buffered,
  currentTime,
  duration,
  tracks,
  waiting,
  selectedTrack,
  volume,
  muted,
  isPictureInPicture,
  supportsPictureInPicture,
  togglePictureInPicture,
  enableTrack,
  disableTrack,
} = controls
const text = stringify(reactive(controls))
const endBuffer = computed(() => buffered.value.length > 0 ? buffered.value[buffered.value.length - 1][1] : 0)
const formatDuration = (seconds: number) => new Date(1000 * seconds).toISOString().slice(14, 19)
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

    <div class="flex flex-row items-center items-center">
      <button @click="playing = !playing">
        <i v-if="!playing" inline-block align-middle i-carbon-play />
        <i v-else i-carbon-pause inline-block align-middle />
      </button>
      <button @click="muted = !muted">
        <i v-if="muted" i-carbon-volume-mute inline-block align-middle />
        <i v-else i-carbon-volume-up inline-block align-middle />
      </button>
      <Scrubber v-model="volume" :max="1" class="w-32 ml-2" />
      <div
        class="flex flex-col flex-1 text-sm ml-2"
      >
        {{ formatDuration(currentTime) }} / {{ formatDuration(duration) }}
      </div>

      <Menu class="mr-2">
        <template #default="{ open }">
          <button @click="open">
            <i i-carbon-closed-caption inline-block align-middle />
          </button>
        </template>
        <template #menu="{ close }">
          <div class="absolute bottom-0 right-0 bg-black rounded py-2 shadow">
            <MenuItem
              @keydown.stop.prevent.enter.space="disableTrack()"
              @click="() => { disableTrack(); close() }"
            >
              <span class="flex-1">Off</span>
              <i i-carbon-checkmark inline-block align-middle :class="{ 'opacity-0': selectedTrack !== -1 }" />
            </MenuItem>
            <MenuItem
              v-for="track in tracks"
              :key="track.id"
              @keydown.stop.prevent.enter.space="enableTrack(track)"
              @click="() => { enableTrack(track); close() }"
            >
              <span class="flex-1">{{ track.label }}</span>
              <i i-carbon-checkmark inline-block align-middle :class="{ 'opacity-0': track.mode !== 'showing' }" />
            </MenuItem>
          </div>
        </template>
      </Menu>
      <Menu class="mr-2">
        <template #default="{ open }">
          <button class="block" @click="open()">
            <i i-carbon-settings inline-block align-middle />
          </button>
        </template>
        <template #menu="{ close }">
          <div class="absolute bottom-0 right-0 shadow py-2 bg-black rounded">
            <MenuItem
              v-if="supportsPictureInPicture"
              @click="() => { togglePictureInPicture(); close(); }"
            >
              <i i-carbon-popup />
              <span>{{ isPictureInPicture ? 'Exit' : 'Enter' }} Picture in Picture</span>
            </MenuItem>
            <MenuItem @click="() => { loop = !loop; close(); }">
              <i i-carbon-repeat />
              <span class="flex-1">Loop</span>
              <i v-if="loop" i-carbon-checkmark />
            </MenuItem>
          </div>
        </template>
      </Menu>
      <Menu>
        <template #default="{ open }">
          <button class="block" @click="open()">
            <i i-carbon-meter inline-block align-middle />
          </button>
        </template>
        <template #menu="{ close }">
          <div class="absolute bottom-0 right-0 shadow py-2 bg-black rounded">
            <MenuItem @click="() => { controls.rate.value = 2; close(); }">
              <i i-carbon-meter-alt />2x
            </MenuItem>
            <MenuItem @click="() => { controls.rate.value = 1; close(); }">
              <i i-carbon-meter-alt />1x
            </MenuItem>
          </div>
        </template>
      </Menu>
    </div>
  </div>
  <pre class="code-block" lang="yaml">{{ text }}</pre>
</template>
