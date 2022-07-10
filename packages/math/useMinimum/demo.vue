<script setup lang="ts">
import { ref } from 'vue'
import { useMinimum } from '@vueuse/math'
const min1 = ref(10)
const min2 = ref(20)
const result = useMinimum(min1, min2)
</script>

<template>
  <div>
    <div>
      min1:
      <input v-model="min1" type="number">
      <button @click="min1--">
        min1 -= 1
      </button>
      <button @click="min1++">
        min1 += 1
      </button>
    </div>
    <div>
      min2:
      <input v-model="min2" type="number">
      <button @click="min2--">
        min2 -= 1
      </button>
      <button @click="min2++">
        min2 += 1
      </button>
    </div>
    result:{{ result }}
  </div>
</template>
