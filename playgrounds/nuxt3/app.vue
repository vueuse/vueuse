<script setup lang="ts">
import { useColorMode, useWindowSize } from '@vueuse/core'
import { onMounted, reactive, ref } from 'vue'

const mounted = ref(false)
const { width, height } = useWindowSize()
const color = useColorMode()

onMounted(() => {
  mounted.value = true
})

const state = reactive({ width, height, color })
const toggleMode = () => {
  state.color = state.color === 'light' ? 'dark' : 'light'
}
</script>

<template>
  <div>{{ state }}</div>
  <div>{{ { mounted } }}</div>
  <button @click="toggleMode">
    {{ color }}
  </button>
</template>

<style>
html.dark {
  background: #222;
  color: white;
}
</style>
