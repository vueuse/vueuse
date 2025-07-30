<script setup lang="ts">
import { stringify, useBattery } from '@vueuse/core'
import { reactive } from 'vue'

const battery = reactive(useBattery())
const text = stringify(battery)
</script>

<template>
  <pre lang="yaml">{{ text }}</pre>
</template>
