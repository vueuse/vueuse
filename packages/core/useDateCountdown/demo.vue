<script setup lang="ts">
import { ref } from 'vue-demi'
import { useDateCountdown } from '@vueuse/core'
// import { UseDateCountDown as CountDown } from './component'
const isFinished = ref(false)
const onEnd = () => isFinished.value = true

const t = new Date(
  new Date(new Date().toLocaleDateString()).getTime()
          + 24 * 60 * 60 * 1000
          - 1,
)

const { formatted, controls: { isActive, pause, resume } } = useDateCountdown(t, { format: 'HH:mm:ss:SSS', interval: 'requestAnimationFrame' })
function toggle() {
  isActive.value ? pause() : resume()
}
</script>

<template>
  <div>
    <p v-if="isActive">
      Time remaining today :  <em class="text-red-400">{{ formatted }}</em>
    </p>
    <p v-else>
      Countdown paused !
    </p>
    <button opacity="75" @click="toggle">
      {{ isActive ? 'Pause' : 'Start' }}
    </button>
  </div>
</template>
