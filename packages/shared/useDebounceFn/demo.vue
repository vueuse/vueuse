<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import { ref } from 'vue'

const updated = ref(0)
const clicked = ref(0)
const pending = ref(false)
const debouncedFn = useDebounceFn(() => {
  updated.value += 1
  pending.value = false
}, 1000, { maxWait: 5000, rejectOnCancel: true })

function clickedFn() {
  clicked.value += 1
  pending.value = true
  debouncedFn()
}

function cancelPending() {
  if (pending.value) {
    debouncedFn.cancel()
    pending.value = false
  }
}
</script>

<template>
  <button @click="clickedFn">
    Smash me!
  </button>
  <button
    :disabled="!pending"
    class="warn opacity-50 disabled:opacity-25"
    @click="cancelPending"
  >
    Cancel pending
  </button>

  <note>Delay is set to 1000ms and maxWait is set to 5000ms for this demo.</note>

  <p>Button clicked: {{ clicked }}</p>
  <p>Event handler called: {{ updated }}</p>
  <p v-if="pending">
    Pending update...
  </p>
</template>
