<script setup lang="ts">
import { useDevicePlatform } from '@vueuse/core'

const os = useDevicePlatform()
</script>

<template>
  <div>Operating System:</div>
  <pre>{{ os }}</pre>
</template>
