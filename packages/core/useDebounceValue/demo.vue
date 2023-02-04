<script setup lang="ts">
import { useDebounceValue } from '@vueuse/core'
import { ref } from 'vue'
const searchQuery = ref<string>('')
const debouncedSearchQuery = useDebounceValue(searchQuery, 100)
</script>

<template>
  <div>
    <input v-model="searchQuery">
    <div>Debounced value: {{ debouncedSearchQuery }}</div>
  </div>
</template>
