<script setup lang="ts">
import { computed } from 'vue-demi'
import { useTextSelection } from './index'
const state = useTextSelection()
const selectedStyle = computed(() => state.value.text ? 'text-primary' : 'text-gray-400')
const position = computed(() => ({ top: state.value.top, right: state.value.right, bottom: state.value.bottom, left: state.value.left }))
const size = computed(() => ({ width: state.value.width, height: state.value.height }))

</script>
<template>
  <div>
    <p class="font-600 text-blue-600">
      You can select any text on the page.
    </p>
    <p><strong class="w-140px inline-block">Selected Text:</strong> <em :class="selectedStyle">{{ state.text || 'No selected' }}</em></p>
    <p><strong class="w-140px inline-block">Selected Position:</strong> {{ JSON.stringify(position) }}</p>
    <p><strong class="w-140px inline-block">Selected Size:</strong> {{ JSON.stringify(size) }}</p>
  </div>
</template>
