<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core'
import { stringify } from '@vueuse/internal-docs-utils'
import { computed, reactive } from 'vue'

const isLargeScreen = useMediaQuery('(min-width: 1024px)')
const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')

const code = computed(() => stringify(reactive({
  isLargeScreen,
  prefersDark,
})))
</script>

<template>
  <pre lang="json">{{ code }}</pre>
</template>
