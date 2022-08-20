<script setup lang="ts">
import { ref } from 'vue'
import { useMark } from '.'

const tbody = ref()
const search = ref('')

useMark(tbody, search)
</script>

<template>
  <input v-model="search" type="text" placeholder="Search">

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
</template>
