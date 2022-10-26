<script setup lang="ts">
import { ref } from 'vue'
import { useSafeArrayIndex } from '.'
const arr = ref(['vueuse', 'vueuse'])
const index = useSafeArrayIndex(arr)
</script>

<template>
  <div>
    <p>array: {{ arr }}</p>
    <button @click="arr.push('vueuse')">
      push
    </button>
    <button @click="arr.splice(0, 1)">
      remove
    </button>
    <p>Index: {{ index }}</p>
    <button @click="index++">
      Increment
    </button>
    <button @click="index--">
      Decrement
    </button>
  </div>
</template>
