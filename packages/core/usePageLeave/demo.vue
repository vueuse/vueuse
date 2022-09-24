<script setup lang="ts">
import { usePageLeave } from '@vueuse/core'

const isLeft = usePageLeave()
</script>

<template>
  <pre lang="json">{{ { isLeft } }}</pre>
</template>
