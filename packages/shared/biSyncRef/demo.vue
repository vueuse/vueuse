<script setup lang="ts">
import { defineComponent, ref } from 'vue-demi'
import { biSyncRef } from '.'

const a = ref('')
const b = ref('')

biSyncRef(a, b)

const a, b
</script>

<template>
  <div>
    <input v-model="a" placeholder="A" />
    <input v-model="b" placeholder="B" />
  </div>
</template>
