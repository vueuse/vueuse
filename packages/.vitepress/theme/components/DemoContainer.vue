<script setup lang="ts">
import { ref as deepRef, onErrorCaptured } from 'vue'

const error = deepRef<Error | null>(null)

onErrorCaptured((err) => {
  error.value = err
})
</script>

<template>
  <div class="demo wide">
    <slot />
    <div v-if="error" class="error">
      {{ error }}
    </div>
  </div>
</template>
