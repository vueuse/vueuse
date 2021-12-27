<script setup lang="ts">
import type { Ref } from 'vue-demi'
import { unref, ref } from 'vue-demi'
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

const data: Ref<User[]> = ref([])

const page = ref(1)
const pageSize = ref(10)

fetch(page.value, pageSize.value).then((responseData) => {
  data.value = responseData
})

const {
  currentPage,
  currentPageSize,
  pageCount,
  isFirstPage,
  isLastPage,
  prev,
  next,
} = usePagination(
  {
    total: database.value.length,
    page: 1,
    pageSize,
    onPageChange() {
      fetch(unref(currentPage), unref(pageSize)).then((responseData) => {
        data.value = responseData
      })
    },
    onPageSizeChange(pageSize) {
      console.log(pageSize)

      fetch(unref(currentPage), pageSize).then((responseData) => {
        data.value = responseData
      })
    },
  },
)

</script>

<template>
  <div>
    currentPage:
    <input v-model="currentPage" type="number">
  </div>
  <div>
    currentPageSize:
    <input v-model="currentPageSize" type="number">
  </div>
  <div>
    pageCount:
    <span>{{ pageCount }}</span>
  </div>

  <div>
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
