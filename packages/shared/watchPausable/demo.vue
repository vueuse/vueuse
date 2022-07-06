<script setup lang="ts">
import { ref } from 'vue'
import { onStartTyping, watchPausable } from '@vueuse/core'

const input = ref<HTMLInputElement | null>()
const log = ref('')

const source = ref('')

const watcher = watchPausable(
  source,
  v => (log.value += `Changed to "${v}"\n`),
)

onStartTyping(() => input.value?.focus())

const clear = () => {
  log.value = ''
}
const pause = () => {
  log.value += 'Paused\n'
  watcher.pause()
}
const resume = () => {
  log.value += 'Resumed\n'
  watcher.resume()
}

const { isActive } = watcher
</script>

<template>
  <div>
    <note class="mb-2">
      Type something below to trigger the watch
    </note>
    <input
      ref="input"
      v-model="source"
      type="text"
    >

    <button :disabled="!isActive" class="orange" @click="pause">
      Pause
    </button>
    <button :disabled="isActive" @click="resume">
      Resume
    </button>
    <button @click="clear">
      Clear Log
    </button>

    <br>
    <br>

    <note>Log</note>

    <pre>{{ log }}</pre>
  </div>
</template>
