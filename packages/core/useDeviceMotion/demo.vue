<script setup lang="ts">
import { reactive } from 'vue-demi'
import { useDeviceMotion } from '.'

const motion = reactive(useDeviceMotion())
</script>

<template>
  <note class="mb-2">
    Device Motion:
  </note>
  <pre lang="json">{{ JSON.stringify(motion, null, 2) }}</pre>
</template>
