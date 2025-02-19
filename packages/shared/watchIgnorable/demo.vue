<script setup lang="ts">
import { watchIgnorable } from '@vueuse/core'
import { shallowRef } from 'vue'

const log = shallowRef('')
const source = shallowRef(0)

const { ignoreUpdates } = watchIgnorable(
  source,
  v => (log.value += `Changed to "${v}"\n`),
  { flush: 'sync' },
)

function clear() {
  source.value = 0
  log.value = ''
}
function update() {
  source.value++
}
function ignoredUpdate() {
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
