<script setup lang="ts">
import { reactive, ref } from 'vue-demi'
import { useElementBounding } from '.'

const el = ref(null)
const rect = reactive(useElementBounding(el))
</script>

<template>
  <div style="min-height: 400px">
    <pre
      ref="el"
      class="resize bg-gray-600 bg-opacity-25 select-none p-4 overflow-auto"
      style="width: 300px; height: 300px"
    >{{ rect }}</pre>
  </div>
</template>
