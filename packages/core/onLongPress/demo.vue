<script setup lang="ts">
import { ref } from 'vue'
import { onLongPress } from '@vueuse/core'
import { OnLongPress } from './component'

const htmlRef = ref<HTMLElement | null>(null)

const longPressed = ref(false)
const clicked = ref(false)

function onLongPressCallback(e: PointerEvent) {
  longPressed.value = true
}

function onClick() {
  clicked.value = true
}

function reset() {
  longPressed.value = false
  clicked.value = false
}

onLongPress(htmlRef, onLongPressCallback)
</script>

<template>
  <p>Long Pressed: <BooleanDisplay :value="longPressed" /></p>
  <p>Clicked: <BooleanDisplay :value="clicked" /></p>
  <button ref="htmlRef" class="ml-2 button small">
    Press long (500ms)
  </button>
  <OnLongPress
    as="button"
    :options="{
      delay: 1000,
    }" class="ml-2 button small"
    @trigger="onLongPressCallback"
    @click="onClick"
  >
    Press long (1000ms)
  </OnLongPress>
  <button class="ml-2 button small" @click="reset">
    Reset
  </button>
</template>
