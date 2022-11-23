<script setup lang="ts">
import { useTimer } from '@vueuse/core'
import { ref } from 'vue-demi'

const initialTime = ref(30)

const { start, pause, reset, status, timer } = useTimer(initialTime, { controls: true })
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
    <p>Status: {{ status }}</p>
  </div>
</template>
