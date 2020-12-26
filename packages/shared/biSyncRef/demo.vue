<script setup lang="ts">
import { ref } from 'vue-demi'
import { biSyncRef } from '.'

const a = ref('')
const b = ref('')

biSyncRef(a, b)
</script>

<template>
  <input v-model="a" placeholder="A">
  <input v-model="b" placeholder="B">
</template>
