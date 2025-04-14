<script setup lang="ts">
import { useBattery } from '@vueuse/core'
import { stringify } from '@vueuse/internal-docs-utils'
import { reactive } from 'vue'

const battery = reactive(useBattery())
const text = stringify(battery)
</script>

<template>
  <pre lang="yaml">{{ text }}</pre>
</template>
