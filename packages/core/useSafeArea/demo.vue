<script setup lang="ts">
import { UseSafeArea } from './component'
import { useSafeArea } from '.'

const { top, right, bottom, left } = useSafeArea()
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
    <div opacity="50">
      component:
    </div>
    <UseSafeArea top right bottom left>
      content
    </UseSafeArea>
  </div>
</template>
