<script setup lang="ts">
import { ref } from 'vue-demi'
import { useTitleCase } from '.'

const input = ref('hello world')
const titleCase = useTitleCase(input)
</script>

<template>
  <note>
    Transform a string into title case following English rules.
  </note>
  <input v-model="input" type="text">
  <p>{{ titleCase }}</p>
</template>
