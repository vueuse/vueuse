<script setup lang="ts">
import { useTimeout } from '@vueuse/core'

const { ready, start } = useTimeout(1000, { controls: true })
</script>

<template>
  <div>
    <p>Ready: {{ ready.toString() }}</p>
    <button :disabled="!ready" @click="start()">
      Start Again
    </button>
  </div>
</template>
