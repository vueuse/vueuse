<script setup lang="ts">
import { computed } from 'vue-demi'
import { useBrowserLocation } from '.'
import { stringify } from '@vueuse/docs-utils'

const location = useBrowserLocation()
const text = stringify(location)
</script>

<template>
  <pre lang="yaml">{{ text }}</pre>
</template>
