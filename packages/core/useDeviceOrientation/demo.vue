<script setup lang="ts">
import { yamlStringify as stringify, useDeviceOrientation } from '@vueuse/core'
import { reactive } from 'vue'

const orientation = reactive(useDeviceOrientation())
const text = stringify(orientation)
</script>

<template>
  <pre lang="yaml">{{ text }}</pre>
</template>
