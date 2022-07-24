<script setup lang="ts">
import { ref } from 'vue'
import { syncRef } from '@vueuse/core'

const a = ref('')
const b = ref('')

syncRef(a, b)

const x = ref(1)
const y = ref(1)

syncRef(x, y, {
  transform: {
    ltr: (left, _) => {
      return left.value + Math.random()
    },
    rtl: (_, right) => {
      return right.value + Math.random()
    },
  },
})
</script>

<template>
  <input v-model="a" placeholder="A" type="text">
  <input v-model="b" placeholder="B" type="text">

  <div class="mt-8">
    <h3>Mutual sync convertor</h3>
    <label class="block">
      Origin
      <input v-model="x" placeholder="Origin value" type="text">
    </label>
    <label>
      Double
      <input v-model="y" placeholder="Double origin value" type="text">
    </label>
  </div>
</template>
