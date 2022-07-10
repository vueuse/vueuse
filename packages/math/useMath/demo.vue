<script setup lang="ts">
import { ref } from 'vue'
import { useMath } from '@vueuse/math'

const number1 = ref(10)
const number2 = ref(20)
const result = useMath('min', number1, number2)
// result.value is 10
</script>

<template>
  <div>
    <div>
      number1:
      <input v-model="number1" type="number">
      <button @click="number1--">
        number1 += 1
      </button>
      <button @click="number1++">
        number1 -= 1
      </button>
    </div>
    <div>
      number2:
      <input v-model="number2" type="number">
      <button @click="number2--">
        number2 += 1
      </button>
      <button @click="number2++">
        number2 -= 1
      </button>
    </div>
    <div>
      result = useMath('min', number1, number2) is {{ result }}
    </div>
  </div>
</template>
