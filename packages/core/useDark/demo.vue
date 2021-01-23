<script setup lang="ts">
import { useDark } from '.'
import { useToggle } from '@vueuse/shared'

const { isDark } = useDark()
const toggleDark = useToggle(isDark)
</script>

<template>
  <button @click="toggleDark">
    Dark: {{ isDark }}
  </button>
</template>
