<script setup lang="ts">
import { defineComponent } from 'vue-demi'
import { useTimeout } from '.'

return useTimeout(1000)
</script>

<template>
  <div>
    <p>Ready: {{ ready.toString() }}</p>
    <button @click="start()" :disabled="!ready">Start Again</button>
  </div>
</template>
