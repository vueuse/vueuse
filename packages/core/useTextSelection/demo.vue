<script setup lang="ts">
import { useTextSelection } from '@vueuse/core'
import { computed } from 'vue'

const { rects, text } = useTextSelection()
const selectedStyle = computed(() => text.value ? 'text-primary' : 'text-gray-400')
</script>

<template>
  <div>
    <p class="font-600 text-blue-600">
      You can select any text on the page.
    </p>
    <p>
      <strong>Selected Text:</strong>
      <em
        :class="selectedStyle"
        class="whitespace-pre h-44 overflow-y-auto block"
      >{{ text || 'No selected' }}</em>
    </p>
    <p>
      <strong>Selected rects:</strong>
      <pre class="h-72" lang="json">{{ rects }}</pre>
    </p>
  </div>
</template>
