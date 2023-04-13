<script setup lang="ts">
import { useCycleList } from '@vueuse/core'
import { ref } from 'vue'

const list = ref([
  'Dog',
  'Cat',
  'Lizard',
  'Shark',
  'Whale',
  'Dolphin',
  'Octopus',
  'Seal',
])

const { state, next, prev } = useCycleList(list)
</script>

<template>
  <div>
    <div class="text-primary text-lg font-bold">
      {{ state }}
    </div>
    <button @click="prev()">
      Prev
    </button>
    <button @click="next()">
      Next
    </button>
  </div>
</template>
