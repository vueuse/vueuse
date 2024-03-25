<script setup lang="ts">
import { ref } from 'vue'
import { useTimeoutFn } from '@vueuse/core'

const defaultText = 'Please wait for 3 seconds'
const text = ref(defaultText)
const { start, isPending, pause, resume, isActive, timeLeft } = useTimeoutFn(() => {
  text.value = 'Fired!'
}, 3000)

function restart() {
  text.value = defaultText
  start()
}
</script>

<template>
  <p>
    {{ text }}
    <template v-if="isPending && !isActive">
      - Paused - Time left: {{ timeLeft }}
    </template>
  </p>
  <button :class="{ disabled: isPending }" @click="restart()">
    Restart
  </button>
  <button v-if="isPending && isActive" @click="pause()">
    Pause
  </button>
  <button v-if="isPending && !isActive" @click="resume()">
    Resume
  </button>
</template>
