<script setup lang="ts">
import { useMediaSession } from '@vueuse/core'
import { computed, shallowRef, useTemplateRef } from 'vue'

const audio = useTemplateRef('audio')

const title = shallowRef('Sintel')
const artist = shallowRef('Blender Foundation')
const album = shallowRef('Open Movies')
const artworkSrc = shallowRef('https://studio.blender.org/files/public/thumbnail/47/a9/47a954682dbd4f064da7e78ad6c2d32f044a3e85_m.webp')

const playbackState = shallowRef<MediaSessionPlaybackState>('paused')

const duration = shallowRef(888)
const position = shallowRef(0)
const playbackRate = shallowRef(1)

const cameraActive = shallowRef(false)
const microphoneActive = shallowRef(false)

const log = shallowRef<string[]>([])
function logAction(action: string, details?: MediaSessionActionDetails) {
  const value = details?.seekTime ?? details?.seekOffset
  log.value = [`${action}${value === undefined ? '' : ` (${value})`}`, ...log.value].slice(0, 5)
}

function seekTo(time: number) {
  position.value = Math.min(Math.max(time, 0), duration.value)
}

const { isSupported, isSetCameraSupported, isSetMicrophoneSupported } = useMediaSession({
  metadata: () => ({
    title: title.value,
    artist: artist.value,
    album: album.value,
    artwork: artworkSrc.value ? [{ src: artworkSrc.value }] : [],
  }),
  playbackState,
  positionState: computed(() => ({
    duration: duration.value,
    position: Math.min(position.value, duration.value),
    playbackRate: playbackRate.value,
  })),
  cameraActive,
  microphoneActive,
}, {
  onPlay: () => {
    logAction('play')
    audio.value?.play()
  },
  onPause: () => {
    logAction('pause')
    audio.value?.pause()
  },
  onStop: () => {
    logAction('stop')
    audio.value?.pause()
    playbackState.value = 'none'
  },
  onSeekBackward: (details) => {
    logAction('seekbackward', details)
    seekTo(position.value - (details.seekOffset ?? 10))
  },
  onSeekForward: (details) => {
    logAction('seekforward', details)
    seekTo(position.value + (details.seekOffset ?? 10))
  },
  onSeekTo: (details) => {
    logAction('seekto', details)
    seekTo(details.seekTime ?? 0)
  },
  onPreviousTrack: () => logAction('previoustrack'),
  onNextTrack: () => logAction('nexttrack'),
})
</script>

<template>
  <div v-if="isSupported">
    <note>
      Browsers only show media controls while audible media plays. Start the audio, then edit the session and watch your OS media controls.
    </note>
    <audio
      ref="audio"
      src="https://upload.wikimedia.org/wikipedia/commons/c/c8/Example.ogg"
      controls
      loop
      class="w-full my-2"
      @play="playbackState = 'playing'"
      @pause="playbackState = 'paused'"
    />

    <h4>Metadata</h4>
    <div class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 items-center">
      <label for="media-session-title">Title</label>
      <input id="media-session-title" v-model="title" type="text">
      <label for="media-session-artist">Artist</label>
      <input id="media-session-artist" v-model="artist" type="text">
      <label for="media-session-album">Album</label>
      <input id="media-session-album" v-model="album" type="text">
      <label for="media-session-artwork">Artwork URL</label>
      <input id="media-session-artwork" v-model="artworkSrc" type="url">
    </div>

    <h4>Playback</h4>
    <div class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 items-center">
      <label for="media-session-state">State</label>
      <select id="media-session-state" v-model="playbackState">
        <option value="none">
          none
        </option>
        <option value="paused">
          paused
        </option>
        <option value="playing">
          playing
        </option>
      </select>
      <label for="media-session-duration">Duration (s)</label>
      <input id="media-session-duration" v-model.number="duration" type="number" min="0">
      <label for="media-session-position">Position ({{ position }} s)</label>
      <input id="media-session-position" v-model.number="position" type="range" min="0" :max="duration">
      <label for="media-session-rate">Playback rate</label>
      <input id="media-session-rate" v-model.number="playbackRate" type="number" min="0.25" max="4" step="0.25">
    </div>

    <h4>Devices</h4>
    <label class="mr-4">
      <input v-model="cameraActive" type="checkbox" :disabled="!isSetCameraSupported">
      Camera active
    </label>
    <label>
      <input v-model="microphoneActive" type="checkbox" :disabled="!isSetMicrophoneSupported">
      Microphone active
    </label>

    <h4>Actions</h4>
    <note>Latest actions from the OS media controls</note>
    <pre>{{ log.length ? log.join('\n') : 'none yet' }}</pre>
  </div>
  <p v-else>
    Your browser does not support the Media Session API
  </p>
</template>
