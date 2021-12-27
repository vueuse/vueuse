<script setup lang="ts">
import type { Ref } from 'vue-demi'
import { ref } from 'vue-demi'
import { usePagination } from '.'

interface User {
  id: number
  name: string
}
const database = ref([]) as Ref<User[]>

for (let i = 0; i < 101; i++)
  database.value.push({ id: i, name: `user ${i}` })

function fetch(page: number, pageSize: number) {
  return new Promise<User[]>((resolve, reject) => {
    const start = (page - 1) * pageSize
    const end = start + pageSize
    setTimeout(() => {
      resolve(database.value.slice(start, end))
    }, 100)
  })
}

const {
  currentPage,
  loading,
  maxPage,
  data,
  isLastPage,
  nextPage,
} = usePagination<User>(
  {
    total: database.value.length,
    initialValue: [],
    fetch,
    immediate: true,
    initialPage: 1,
    pageSize: 10,
  },
)

</script>

<template>
  <div>
    currentPage:
    <input v-model="currentPage" type="text">
  </div>
  <div>
    maxPage:
    <input v-model="maxPage" type="text">
  </div>
  <div>loading:{{ loading }}</div>
  <div>
    isLastPage:
    <input v-model="isLastPage" type="text">
  </div>

  <div>
    <ul />
  </div>

  <button
    :disabled="isLastPage"
    @click="nextPage"
  >
    {{ isLastPage ? 'no more data' : 'fetch next page' }}
  </button>

  <table>
    <thead>
      <tr>
        <td>id</td>
        <td>name</td>
      </tr>
    </thead>
    <tr v-for="d in data" :key="d.id">
      <td>{{ d.id }}</td>
      <td>{{ d.name }}</td>
    </tr>
  </table>
</template>
