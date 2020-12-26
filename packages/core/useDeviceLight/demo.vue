<script setup lang="ts">
import { useDeviceLight } from '.'

const light = useDeviceLight()
</script>

<template>
  <pre lang="json">{{ JSON.stringify({ light }, null, 2) }}</pre>
</template>
