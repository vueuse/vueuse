<script setup lang="ts">
import { useBirthFormatter } from '@vueuse/core'
import { shallowRef } from 'vue'

const inputVal = shallowRef('')
</script>

<template>
  <input v-model="inputVal" type="text" placeholder="Enter birth date" @input="(e) => inputVal = useBirthFormatter('/', e)">
</template>
