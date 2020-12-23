<script setup lang="ts">
import { defineComponent, ref } from 'vue-demi'
import { useElementVisibility } from '.'

const demo = ref(null)
const demoIsVisible = useElementVisibility(demo)

const demo, demoIsVisible
</script>

<template>
  <div>
    <div class="border border-dashed mb-20 mx-5 px-6 py-5" ref="demo">
      <h1>Target Element (scroll down)</h1>
    </div>
    <div class="py-20"></div>
    <div class="demo fixed bottom-0 right-0 pa-3">
      {{ demoIsVisible ? 'In the viewport' : 'Outside the viewport' }}
    </div>
  </div>
</template>
