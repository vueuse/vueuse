<script setup lang="ts">
import './style.css'
import { useNProgress } from '.'

const { isLoading, progress } = useNProgress()
</script>

<template>
  <note class="mb-2">
    Click to change progress status
  </note>
  <button @click="isLoading = !isLoading">
    {{ !isLoading ? 'Start' : 'Stop' }}
  </button>
  <b v-if="isLoading" class="ml-2">{{ ((progress || 0) * 100).toFixed(0) }}%</b>
</template>
