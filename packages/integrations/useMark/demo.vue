<script setup lang="ts">
import { ref } from 'vue'
import { useMark } from '.'
import type { UseMarkOptions } from '.'

const tbody = ref<HTMLElement | null>()
const search = ref('col2')
const options = ref<UseMarkOptions<false>>({
  acrossElements: true,
  separateWordSearch: false,
})
const { totalMarks } = useMark(tbody, search, options)

const p = ref<HTMLElement | null>()
const manualSearch = ref('ipsum')
const { mark, unmark } = useMark(p, manualSearch, { manual: true })
</script>

<template>
  <input v-model="search" type="text" placeholder="Search">

  <p>Total Marks: {{ totalMarks }}</p>

  <table>
    <thead>
      <tr>
        <th>Column 1</th>
        <th>Column 2</th>
        <th>Column 3</th>
      </tr>
    </thead>

    <tbody ref="tbody">
      <tr>
        <td>col1 value 1</td>
        <td>col2 <b>value</b> 1</td>
        <td>col3 <i>value</i> 1</td>
      </tr>
      <tr>
        <td>col1 value 2</td>
        <td>col2 <b>value</b> 2</td>
        <td>col3 <i>value</i> 2</td>
      </tr>
      <tr>
        <td>col1 value 3</td>
        <td>col2 <b>value</b> 3</td>
        <td>col3 <i>value</i> 3</td>
      </tr>
    </tbody>
  </table>

  <hr>

  <input v-model="manualSearch" type="text" placeholder="Search">

  <button @click="mark()">
    mark
  </button>

  <button @click="unmark()">
    unmark
  </button>

  <p ref="p">
    Lorem ipsum dolor sit amet.
  </p>
</template>
