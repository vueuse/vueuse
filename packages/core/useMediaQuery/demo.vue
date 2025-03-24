<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core'
import { computed, reactive } from 'vue'
import yaml from 'yaml'

const isLargeScreen = useMediaQuery('(min-width: 1024px)')
const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')

const code = computed(() => yaml.stringify(reactive({
  isLargeScreen,
  prefersDark,
})))
</script>

<template>
  <pre lang="json">{{ code }}</pre>
</template>
