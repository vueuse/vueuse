<script setup lang="ts">
import { useQuickSort } from '@vueuse/core'
const arr = [1.3, 5, 12, 46, 57, 45, 23, 4, 436, 364, 532, 23]
const result = useQuickSort(arr)

const objArr = [{
  name: 'John',
  age: 40,
}, {
  name: 'Jane',
  age: 20,
}, {
  name: 'Joe',
  age: 30,
}, {
  name: 'Jenny',
  age: 22,
}]
const result2 = useQuickSort(objArr, {
  compareFn: (a, b) => a.age - b.age,
})
</script>

<template>
  <div>{{ result }}</div>
  <div>{{ result2 }}</div>
</template>
