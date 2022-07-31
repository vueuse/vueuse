<script setup lang="ts">
import { ref } from 'vue-demi'
import { useObjectTemplate } from '.'

const origin = ref({
  fruit: 'Banana',
  drink: 'Water',
})

const { template, reset } = useObjectTemplate(origin)
</script>

<template>
  <input v-model="template.fruit" type="text">
  <input v-model="template.drink" type="text">

  <button @click="reset()">
    reset
  </button>
</template>
