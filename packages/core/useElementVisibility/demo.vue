<script setup lang="ts">
import { ref } from 'vue-demi'
import { useElementVisibility } from '.'

const demo = ref(null)
const demoIsVisible = useElementVisibility(demo)
</script>

<template>
  <div ref="demo" class="border border-dashed mb-20 mx-5 px-6 py-5">
    <div>Target Element (scroll down)</div>
  </div>
  <div class="py-20" />
  <div class="demo fixed bottom-0 right-0 pa-3">
    {{ demoIsVisible ? 'In the viewport' : 'Outside the viewport' }}
  </div>
</template>
