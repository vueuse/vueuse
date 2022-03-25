<script setup lang="ts">
import { ref } from 'vue'
import { onLongPress } from '@vueuse/core'

const htmlRef = ref<HTMLElement | null>(null)
const htmlRefOptions = ref<HTMLElement | null>(null)

const longPressed = ref(false)

const onLongPressCallback = (e: PointerEvent) => {
  longPressed.value = true
}

const reset = () => {
  longPressed.value = false
}

onLongPress(htmlRef, onLongPressCallback)
onLongPress(htmlRefOptions, onLongPressCallback, { delay: 1000 })
</script>

<template>
  <p>Long Pressed: <BooleanDisplay :value="longPressed" /></p>
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
