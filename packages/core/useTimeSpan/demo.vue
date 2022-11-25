<script setup lang="ts">
import { ref } from 'vue'
import { useTimeSpan } from '@vueuse/core'

const ms = ref(555555555)
const { days, hours, minutes, seconds, milliseconds, formatted } = useTimeSpan(ms)
</script>

<template>
  <div>
    <div class="flex items-center">
      <span class="mr-5px text-18px">Time (ms): </span>
      <input v-model="ms" type="number">
    </div>
    <p class="text-20px font-bold text-emerald-500">
      {{ formatted }}
    </p>
    <div>Days: {{ days }}, Hours: {{ hours }}, Minutes: {{ minutes }}, Seconds: {{ seconds }}, Milliseconds: {{ milliseconds }}</div>
  </div>
</template>
