<script setup lang="ts">
import { useDeviceOrientation } from '@vueuse/core'
import { stringify } from '@vueuse/docs-utils'
import { reactive } from 'vue'

const orientation = reactive(useDeviceOrientation())
const text = stringify(orientation)
</script>

<template>
  <pre lang="yaml">{{ text }}</pre>
</template>
