<script setup lang="ts">
import { computed, ref } from 'vue'
import { useUnique } from '.'

const arrText = ref('[2, 2, 3, 4, 5, 6, 7, 7, 8]')
const inputArr = computed(() => JSON.parse(arrText.value))
const inputOut = useUnique(inputArr)
</script>

<template>
  <div>
    <div class="flex items-center">
      input:
      <input v-model="arrText" type="text">
    </div>
    output: {{ inputOut }}
  </div>
</template>
