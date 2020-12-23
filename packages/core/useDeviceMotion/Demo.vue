<script setup lang="ts">
import { defineComponent, reactive } from 'vue-demi'
import { useDeviceMotion } from '.'

const motion = reactive(
  useDeviceMotion({
    window: window.parent,
  }),
)
</script>

<template>
  <pre lang="json">{{ JSON.stringify(motion, null, 2) }}</pre>
</template>
