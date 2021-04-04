<script setup lang="ts">
import { defineProps } from 'vue'

defineProps<{
  value: boolean
}>()
</script>

<template>
  <div
    class="font-mono px-4 py-2 rounded "
    :class="value ? 'opacity-100 text-primary bg-primary bg-opacity-10' : 'opacity-50 bg-gray-400 bg-opacity-5'"
  >
    <slot />
  </div>
</template>
