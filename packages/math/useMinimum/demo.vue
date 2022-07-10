<script setup lang="ts">
import { ref } from 'vue'
import { useMinimum } from '@vueuse/math'
const other = ref(10)

const value = useMinimum(0, other)
</script>

<template>
  <div>
    <div>
      other:
      <input v-model="other" type="number">
      <button @click="other--">
        other -= 1
      </button>
      <button @click="other++">
        other += 1
      </button>
    </div>
    value:{{ value }}
    <div>
      <button @click="value--">
        value -= 1
      </button>
      <button @click="value++">
        value += 1
      </button>
    </div>
  </div>
</template>
