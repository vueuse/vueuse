<script setup lang="ts">
import { syncRefs } from '@vueuse/core'
import { shallowRef } from 'vue'

const source = shallowRef('')
const target1 = shallowRef('')
const target2 = shallowRef('')

syncRefs(source, [target1, target2])
</script>

<template>
  <div>
    <input v-model="source" placeholder="Source" type="text">
    <input v-model="target1" placeholder="Target1" type="text">
    <input v-model="target2" placeholder="Target2" type="text">
  </div>
</template>
