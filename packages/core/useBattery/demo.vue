<script setup lang="ts">
import { reactive } from 'vue-demi'
import { stringify } from '@vueuse/docs-utils'
import { useBattery } from '.'

const battery = reactive(useBattery())
const text = stringify(battery)
</script>

<template>
  <pre lang="yaml">{{ text }}</pre>
</template>
