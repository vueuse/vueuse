<script setup lang="ts">
import { useThrottleFn } from '@vueuse/core'
import { shallowRef } from 'vue'

const updated = shallowRef(0)
const clicked = shallowRef(0)
const throttledFn = useThrottleFn(() => {
  updated.value += 1
}, 1000)

function clickedFn() {
  clicked.value += 1
  throttledFn()
}
</script>

<template>
  <div>
    <button @click="clickedFn">
      Smash me!
    </button>
    <note>Delay is set to 1000ms for this demo.</note>

    <p>Button clicked: {{ clicked }}</p>
    <p>Event handler called: {{ updated }}</p>
  </div>
</template>
