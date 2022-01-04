<script setup lang="ts">
import { computed, ref } from 'vue-demi'
import { useDateFormat } from '.'

const now = ref(Date.now())
const formatted = computed(() => useDateFormat(now))
setInterval(() => {
  now.value = Date.now()
}, 1000)

</script>

<template>
  <div>{{ formatted }}</div>
</template>
