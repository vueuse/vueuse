<script setup lang="ts">
import { computed } from 'vue-demi'
import { useBrowserLocation } from '.'

const location = useBrowserLocation()
const code = computed(() => JSON.stringify(location.value, null, 2))
</script>

<template>
  <pre lang="">{{ code }}</pre>
</template>
