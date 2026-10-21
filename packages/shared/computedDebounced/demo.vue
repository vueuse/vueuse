<script setup lang="ts">
import { computedDebounced } from '@vueuse/core'
import { ref } from 'vue'

const input = ref('')
const delay = ref(500)

const stats = computedDebounced(() => {
  const text = input.value.trim()
  return {
    words: text ? text.split(/\s+/).length : 0,
    chars: text.length,
  }
}, delay)
</script>

<template>
  <div>
    <div class="demo-input">
      <input v-model="input" type="text" placeholder="Type something..." />
    </div>
    <div class="demo-stats">
      <span>words: {{ stats.words }}</span>
      <span>chars: {{ stats.chars }}</span>
      <span class="demo-delay">updates {{ delay }}ms after you stop typing</span>
    </div>
  </div>
</template>

<style scoped>
.demo-input input {
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 0.375rem;
  background: transparent;
  color: var(--vp-c-text-1);
}

.demo-stats {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
}

.demo-delay {
  margin-left: auto;
}
</style>
