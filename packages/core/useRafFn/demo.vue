<script setup lang="ts">
import { ref } from 'vue'
import { useRafFn } from '@vueuse/core'

const count = ref(0)
const options = ref({
  intervalFrame: 1
})
const { pause, resume } = useRafFn(() => count.value += 1, options.value)
</script>

<template>
  <div>Count: {{ count }}</div>
  <div class='grid grid-cols-[120px_auto] gap-2'>
    <span text="left" opacity="75" class="py-4">intervalFrame</span>
    <div class="text-primary">
      <div>
        <input v-model="options.intervalFrame" type="number" min="1" max="20" step="1" class="w-full !min-w-0">
      </div>
    </div>
  </div>
  <button @click="pause">
    pause
  </button>
  <button @click="resume">
    resume
  </button>
</template>
