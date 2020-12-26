<script setup lang="ts">
import { ref } from 'vue-demi'
import { pausableWatch } from '.'
import { onStartTyping } from '../../core'

const input = ref<HTMLInputElement | null>()
const log = ref('')

const source = ref('')

const watcher = pausableWatch(
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
    <input
      ref="input"
      v-model="source"
      placeholder="Type something to trigger the watch"
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

    <note>Log</note>

    <pre>{{ log }}</pre>
  </div>
</template>
