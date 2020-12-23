<script setup lang="ts">
import { defineComponent, ref } from 'vue-demi'
import { pausableWatch } from '.'
import { onStartTyping } from '../../core'

const input = ref<HTMLInputElement | null>()
const log = ref('')

const source = ref('')

const clear = () => {
  log.value = ''
}

const { pause, resume, isActive } = pausableWatch(
  source,
  (v) => (log.value += `Changed to "${v}"\n`)
)

onStartTyping(() => input.value?.focus())

const input,
  log,
  source,
  clear,
  pause = () => {
    log.value += 'Paused\n'
    pause()
  },
  resume = () => {
    log.value += 'Resumed\n'
    resume()
  },
  isActive
</script>

<template>
  <div>
    <input
      v-model="source"
      ref="input"
      placeholder="Type something to trigger the watch"
    />

    <button @click="pause" :disabled="!isActive" class="orange">Pause</button>
    <button @click="resume" :disabled="isActive">Resume</button>
    <button @click="clear">Clear Log</button>

    <br />

    <note>Log</note>

    <pre>{{ log }}</pre>
  </div>
</template>
