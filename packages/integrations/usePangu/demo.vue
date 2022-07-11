<script setup lang="ts">
import { ref } from 'vue'
import { usePangu } from '.'

const text = ref('当你凝视bug时，bug也在凝视你')
const pangu = usePangu(text)
</script>

<template>
  <input v-model="text" type="text">
  {{ pangu }}
</template>
