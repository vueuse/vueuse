<script setup lang="ts">
import { reactive } from 'vue-demi'
import { useBattery } from '.'

const battery = reactive(useBattery())
</script>

<template>
  <pre lang="json">{{ JSON.stringify(battery, null, 2) }}</pre>
</template>
