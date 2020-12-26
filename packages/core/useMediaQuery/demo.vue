<script setup lang="ts">
import { computed } from 'vue-demi'
import { useMediaQuery } from '.'

const isLargeScreen = useMediaQuery('(min-width = 1024px)')
const prefersDark = useMediaQuery('(prefers-color-scheme = dark)')

const display = computed(() =>
  JSON.stringify(
    {
      isLargeScreen,
      prefersDark,
    },
    null,
    2,
  ),
)
</script>

<template>
  <pre lang="json">{{ display }}</pre>
</template>
