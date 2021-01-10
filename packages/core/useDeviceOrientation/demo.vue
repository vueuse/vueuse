<script setup lang="ts">
import { reactive } from 'vue-demi'
import { useDeviceOrientation } from '.'

const orientation = reactive(useDeviceOrientation())
</script>

<template>
  <pre lang="json">{{ JSON.stringify(orientation, null, 2) }}</pre>
</template>
