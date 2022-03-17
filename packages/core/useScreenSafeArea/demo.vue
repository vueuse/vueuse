<script setup lang="ts">
import { useScreenSafeArea } from '@vueuse/core'

const {
  top,
  right,
  bottom,
  left,
} = useScreenSafeArea()
</script>

<template>
  <div class="inline-grid grid-cols-2 gap-x-4 gap-y-2">
    <div opacity="50">
      top:
    </div>
    <div>{{ top }}</div>
    <div opacity="50">
      right:
    </div>
    <div>{{ right }}</div>
    <div opacity="50">
      bottom:
    </div>
    <div>{{ bottom }}</div>
    <div opacity="50">
      left:
    </div>
    <div>{{ left }}</div>
  </div>
</template>
