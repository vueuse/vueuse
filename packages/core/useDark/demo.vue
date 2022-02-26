<script setup lang="ts">
import { useToggle } from '@vueuse/shared'
import { isDark } from '../../.vitepress/theme/composables/dark'

// const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

<template>
  <button @click="toggleDark()">
    <carbon-moon v-if="isDark" class="align-middle" />
    <carbon-sun v-else class="align-middle" />

    <span class="ml-2">{{ isDark ? 'Dark': 'Light' }}</span>
  </button>
</template>
