<script setup lang="ts">
import { computed, ref } from 'vue'
import { useTextSelection } from '@vueuse/core'

const demo = ref()
const { rects, text } = useTextSelection()
const selectedStyle = computed(() => text.value ? 'text-primary' : 'text-gray-400')
</script>

<template>
  <div ref="demo">
    <p class="font-600 text-blue-600">
      You can select any text on the page.
    </p>
    <p>
      <strong class="w-140px inline-block">Selected Text:</strong>
      <em
        :class="selectedStyle"
        class="whitespace-pre h-72 overflow-y-auto inline-block"
      >{{ text || 'No selected' }}</em>
    </p>
    <p>
      <strong class="w-140px inline-block">Selected rects:</strong>
      {{ JSON.stringify(rects) }}
    </p>
  </div>
</template>
