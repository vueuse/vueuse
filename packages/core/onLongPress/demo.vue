<script setup lang="ts">
import { ref } from 'vue'
import { onLongPress } from './'

const htmlRef = ref<HTMLElement | null>(null)
const htmlRefOptions = ref<HTMLElement | null>(null)
const htmlRefOnMouseUp = ref<HTMLElement | null>(null)

const longPressed = ref(false)
const clicked = ref(false)

function onLongPressCallback(e: PointerEvent | TouchEvent) {
  longPressed.value = true
}

function onMouseUpCallback(duration: number, distance: number, isLongPress: boolean) {
  if (!isLongPress)
    clicked.value = true

  console.log({ distance, duration, isLongPress })
}

function reset() {
  longPressed.value = false
  clicked.value = false
}

onLongPress(htmlRef, onLongPressCallback)
onLongPress(htmlRefOptions, onLongPressCallback, { delay: 1000 })
onLongPress(
  htmlRefOnMouseUp,
  onLongPressCallback,
  {
    distanceThreshold: 24,
    delay: 1000,
    onMouseUp: onMouseUpCallback,
  },
)
</script>

<template>
  <p>Long Pressed: <BooleanDisplay :value="longPressed" /></p>
  <p>Clicked: <BooleanDisplay :value="clicked" /></p>
  <button ref="htmlRef" class="ml-2 button small">
    Press long (500ms)
  </button>
  <button ref="htmlRefOptions" class="ml-2 button small">
    Press long (1000ms)
  </button>
  <button ref="htmlRefOnMouseUp" class="ml-2 button small">
    Press long (1000ms) or click
  </button>
  <button class="ml-2 button small" @click="reset">
    Reset
  </button>
</template>
