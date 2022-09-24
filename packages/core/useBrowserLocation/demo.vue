<script setup lang="ts">
import { stringify } from '@vueuse/docs-utils'
import { useBrowserLocation } from '@vueuse/core'

const location = useBrowserLocation()
const text = stringify(location)
</script>

<template>
  <pre lang="yaml">{{ text }}</pre>
</template>
