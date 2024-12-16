<script setup lang="ts">
import { useDeviceMotion } from '@vueuse/core'
import { computed, reactive } from 'vue'

const motion = reactive(useDeviceMotion())
const text = computed(() => JSON.stringify(motion, null, 2))
</script>

<template>
  <note class="mb-2">
    Device Motion:
  </note>
  <pre lang="json">{{ text }}</pre>
</template>
