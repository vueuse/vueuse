<template>
  <button class="icon-button" @click="toggle">
    <carbon-moon v-show="isDark" />
    <carbon-sun v-show="!isDark" />
  </button>
</template>

<script setup lang='ts'>
import { isDark } from '../composables/darkmode'
import { useToggle } from '@vueuse/core'

const toggle = useToggle(isDark)
</script>
