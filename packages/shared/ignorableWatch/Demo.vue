<script setup lang="ts">
import { defineComponent, ref } from 'vue-demi'
import { ignorableWatch } from '.'

const input = ref<HTMLInputElement | null>()
const log = ref('')

const source = ref(0)

const clear = () => {
  log.value = ''
  source.value = 0
}

const { ignoreUpdates } = ignorableWatch(
  source,
  (v) => (log.value += `Changed to "${v}"\n`)
)

const input,
  log,
  source,
  clear,
  update = () => {
    source.value++
  },
  ignoredUpdate = () => {
    ignoreUpdates(() => {
      source.value++
    })
  }
</script>

<template>
  <div>
    <p>{{ 'source value: ' + source }}</p>

    <button @click="update">Update</button>
    <button @click="ignoredUpdate" class="orange">Ignored Update</button>
    <button @click="clear">Clear Log</button>

    <br />

    <note>Log</note>

    <pre>{{ log }}</pre>
  </div>
</template>
