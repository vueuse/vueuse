<script setup lang="ts">
import { ref } from 'vue'
import { useVisible } from '@vueuse/core'

const htmlRef = ref<HTMLElement | null>(null)

const { visible } = useVisible(htmlRef, true)
</script>

<template>
  <p>Visible: <BooleanDisplay :value="visible" /></p>
  <div ref="htmlRef">
    Hello World
  </div>
  <button class="ml-2 button small" @click="() => visible = !visible">
    Toggle
  </button>
</template>
