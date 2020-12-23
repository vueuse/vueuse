<script setup lang="ts">
import { defineComponent, ref } from 'vue-demi'
import { useRafFn } from '.'

const count = ref(0)
const { pause, resume } = useRafFn(() => {
  count.value += 1
})

const count, pause, resume
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
  </div>
</template>
