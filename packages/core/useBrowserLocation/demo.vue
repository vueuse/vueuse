<script setup lang="ts">
import { stringify } from '@vueuse/docs-utils'
import { useBrowserLocation } from '.'

const location = useBrowserLocation()
const text = stringify(location)
</script>

<template>
  <pre lang="yaml">{{ text }}</pre>
</template>
