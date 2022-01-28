<script setup lang="ts">
import { ref } from 'vue-demi'
import { onLongpress } from '.'

const htmlRef = ref<HTMLElement | null>(null)
const htmlRefOptions = ref<HTMLElement | null>(null)

const longPressed = ref(false)

const onLongpressCallback = (e: PointerEvent) => {
  longPressed.value = true
}

const reset = () => {
  longPressed.value = false
}

onLongpress(htmlRef, onLongpressCallback)
onLongpress(htmlRefOptions, onLongpressCallback, { delay: 1000 })
</script>

<template>
  <p>Longpressed: {{ longPressed }}</p>

  <button ref="htmlRef" class="ml-2 button small">
    Press long (500ms)
  </button>
  <button ref="htmlRefOptions" class="ml-2 button small">
    Press long (1000ms)
  </button>

  <button class="ml-2 button small" @click="reset">
    Reset
  </button>
</template>
