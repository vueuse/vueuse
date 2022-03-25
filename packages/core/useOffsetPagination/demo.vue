<script setup lang="ts">
import type { Ref } from 'vue'
import { ref } from 'vue'
import { useOffsetPagination } from '@vueuse/core'

interface User {
  id: number
  name: string
}
const database = ref([]) as Ref<User[]>

for (let i = 0; i < 80; i++)
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

const data: Ref<User[]> = ref([])

const page = ref(1)
const pageSize = ref(10)

fetchData({
  currentPage: page.value,
  currentPageSize: pageSize.value,
})

function fetchData({ currentPage, currentPageSize }: { currentPage: number; currentPageSize: number }) {
  fetch(currentPage, currentPageSize).then((responseData) => {
    data.value = responseData
  })
}

const {
  currentPage,
  currentPageSize,
  pageCount,
  isFirstPage,
  isLastPage,
  prev,
  next,
} = useOffsetPagination({
  total: database.value.length,
  page: 1,
  pageSize,
  onPageChange: fetchData,
  onPageSizeChange: fetchData,
})
</script>

<template>
  <div class="gap-x-4 gap-y-2 grid-cols-2 inline-grid items-center">
    <div opacity="50">
      total:
    </div>
    <div>{{ database.length }}</div>
    <div opacity="50">
      pageCount:
    </div>
    <div>{{ pageCount }}</div>
    <div opacity="50">
      currentPageSize:
    </div>
    <div>{{ currentPageSize }}</div>
    <div opacity="50">
      currentPage:
    </div>
    <div>{{ currentPage }}</div>
    <div opacity="50">
      isFirstPage:
    </div>
    <div>{{ isFirstPage }}</div>
    <div opacity="50">
      isLastPage:
    </div>
    <div>{{ isLastPage }}</div>
  </div>
  <div class="my-4">
    <button :disabled="isFirstPage" @click="prev">
      prev
    </button>
    <button
      v-for="item in pageCount"
      :key="item"
      :disabled="currentPage === item"
      @click="currentPage = item"
    >
      {{ item }}
    </button>
    <button :disabled="isLastPage" @click="next">
      next
    </button>
  </div>

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
