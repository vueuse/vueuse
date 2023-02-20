<script setup lang="ts">
import { useSearch } from '@vueuse/core'
import { ref } from 'vue'

const list = ref([
  {
    name: 'Jane1',
    age: 20,
  },
  {
    name: 'Jane2',
    age: 22,
  },
  {
    name: 'Yang1',
    age: 30,
  },
  {
    name: 'Yang2',
    age: 40,
  },
])
const keyword = ref('')
const { data } = useSearch(list, keyword, { field: 'name' })
</script>

<template>
  <p>
    <input v-model="keyword" type="text">
  </p>
  <ul>
    <li v-for="item in data" :key="item">
      {{ item }}
    </li>
  </ul>
</template>
