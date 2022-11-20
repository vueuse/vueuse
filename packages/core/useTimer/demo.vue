<script setup lang="ts">
import { useTimer } from '@vueuse/core'
import { ref } from 'vue-demi'

const initialTime = ref(86400)

const { start, pause, reset, status, timer, hours, minutes, seconds, days } = useTimer(initialTime, () => {
  initialTime.value += 5
})
</script>

<template>
  <div>
    <p>UseTimer: {{ timer }}</p>
    <button :disabled="status === 'RUNNING'" @click="start">
      start
    </button>
    <button @click="pause">
      pause
    </button>
    <button @click="reset">
      reset
    </button>
    <p>Days: {{ days }}</p>
    <p>Hours: {{ hours }}</p>
    <p>Minutes: {{ minutes }}</p>
    <p>Seconds: {{ seconds }}</p>
    <p>Status: {{ status }}</p>
  </div>
</template>
