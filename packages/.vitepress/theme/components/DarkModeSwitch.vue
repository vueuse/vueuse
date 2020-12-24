<template>
  <button class="switch" @click="toggle">
    <moon v-if="isDark" />
    <sun v-else />
  </button>
</template>

<script setup lang='ts'>
import Moon from './icons/Moon.vue'
import Sun from './icons/Sun.vue'
import { isDark } from '../composables/darkmode'

const toggle = () => isDark.value = !isDark.value
</script>

<style scoped>
.switch {
  font-size: 1.2em;
  margin-left: 2rem;
  border: 0;
  outline: none;
  background: none;
  color: var(--c-text);
}
</style>
