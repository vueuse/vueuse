<template>
  <button class="switch" @click="toggle">
    <moon v-show="isDark" />
    <sun v-show="!isDark" />
  </button>
</template>

<script setup lang='ts'>
import Moon from './icons/Moon.vue'
import Sun from './icons/Sun.vue'
import { isDark } from '../composables/darkmode'
import { useToggle } from '../../../shared'

const toggle = useToggle(isDark)
</script>

<style scoped>
.switch {
  display: flex;
  font-size: 1.2em;
  margin-left: 1rem;
  border: 0;
  outline: none;
  background: none;
  color: var(--c-text);
}
.switch svg {
  margin: auto;
}
</style>
