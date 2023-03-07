<script setup lang="ts">
import { stringify } from '@vueuse/docs-utils'
import { useBrowserLocation } from '@vueuse/core'

const location = useBrowserLocation()
const text = stringify(location)
</script>

<template>
  Input and hash will be changed:
  <input v-model="location.hash" type="text" placeholder="Hash">
  <pre lang="yaml">{{ text }}</pre>
</template>
