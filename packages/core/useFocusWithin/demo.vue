<script setup lang="ts">
import { ref } from 'vue-demi'
import { useFocusWithin } from '.'

const target = ref()

const { focused } = useFocusWithin(target)
</script>

<template>
  <div class="flex flex-col items-center">
    <form
      ref="target"
      class="shadow-lg bg-gray-600 bg-opacity-10 dark:(bg-gray-400 bg-opacity-10) rounded max-w-96 mx-auto p-8"
    >
      <input type="text" placeholder="First Name">
      <input type="text" placeholder="Last Name">
      <input type="text" placeholder="Email">
      <input type="text" placeholder="Password">
    </form>
    <span>
      Form contains focus: <BooleanDisplay :value="focused" />
    </span>
  </div>
</template>

<style scoped>
</style>
