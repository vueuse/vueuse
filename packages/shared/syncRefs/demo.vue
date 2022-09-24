<script setup lang="ts">
import { ref } from 'vue'
import { syncRefs } from '@vueuse/core'

const source = ref('')
const target1 = ref('')
const target2 = ref('')

syncRefs(source, [target1, target2])
</script>

<template>
  <div>
    <input v-model="source" placeholder="Source" type="text">
    <input v-model="target1" placeholder="Target1" type="text">
    <input v-model="target2" placeholder="Target2" type="text">
  </div>
</template>
