<script setup lang="ts">
import { ref } from 'vue'
import { useToFixed } from '@vueuse/math'
import type { FixedTypes } from '@vueuse/math'
const num = ref(314.15926)
const digits = ref(2)
const options = ref({
  type: 'number',
  math: 'round',
} as FixedTypes)
const value = useToFixed(num, digits, options)
</script>

<template>
  <br>
  input:
  <input v-model="num" type="number">
  digits:
  <div>
    <button @click="digits--">
      -
    </button>
    {{ digits }}
    <button @click="digits++">
      +
    </button>
  </div>
  type:
  <div>
    <button @click="options.type = 'string'">
      string
    </button>
    <button @click="options.type = 'number'">
      number
    </button>
  </div>
  math:
  <div>
    <button @click="options.math = 'round'">
      round
    </button>
    <button @click="options.math = 'floor'">
      floor
    </button>
    <button @click="options.math = 'ceil'">
      ceil
    </button>
  </div>
  value:{{ value }}
  <br>
  typeof value:{{ typeof value }}
</template>
