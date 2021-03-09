<script setup lang="ts">
import { ref } from 'vue-demi'
import { ignorableWatch } from '.'

const input = ref<HTMLInputElement | null>()
const log = ref('')
const source = ref(0)

const { ignoreUpdates } = ignorableWatch(
  source,
  v => (log.value += `Changed to "${v}"\n`),
  { flush: 'sync' },
)

const clear = () => {
  source.value = 0
  log.value = ''
}
const update = () => {
  source.value++
}
const ignoredUpdate = () => {
  ignoreUpdates(() => {
    source.value++
  })
}
</script>

<template>
  <div>Value: {{ source }}</div>
  <button @click="update">
    Update
  </button>
  <button class="orange" @click="ignoredUpdate">
    Ignored Update
  </button>
  <button @click="clear">
    Reset
  </button>

  <br>

  <note>Log</note>

  <pre>{{ log }}</pre>
</template>
