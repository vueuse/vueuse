<script setup lang="ts">
import { ref } from 'vue-demi'
import { useResizeObserver } from '.'

const el = ref(null)
const text = ref('')

useResizeObserver(el, (entries) => {
  const [entry] = entries
  const { width, height } = entry.contentRect
  text.value = `width: ${width}, height: ${height}`
})
</script>

<template>
  <textarea
    ref="el"
    v-model="text"
    disabled
  />
</template>

<style scoped>
textarea {
  resize: both;
  background: transparent;
  padding: 10px;
  border: 1px solid #ffffff33;
  width: 300px;
}
</style>
