<script setup lang="ts">
import { rand } from '@vueuse/shared'
import { computed, ref } from 'vue'
import { useSorted } from '.'

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
const result2 = useSorted(objArr, (a, b) => a.age - b.age)

const arrText = ref('')
const inputArr = computed(() => arrText.value.split(','))
const inputOut = useSorted(inputArr)

function randomArr() {
  const arr = []
  for (let i = 0; i < rand(10, 20); i++)
    arr.push(rand(0, 100))
  arrText.value = arr.join(',')
}

randomArr()
</script>

<template>
  <div>
    <div class="flex items-center">
      input:
      <input v-model="arrText" type="text">
    </div>
    <div>
      <button @click="randomArr">
        random
      </button>
    </div>
    output: {{ inputOut }}
  </div>

  <div class="mt-10">
    <div>object property sort:</div>
    <div>input:</div>
    <div>{{ objArr }}</div>
    <div class="mt-5">
      output:
    </div>
    <div>{{ result2 }}</div>
  </div>
</template>
