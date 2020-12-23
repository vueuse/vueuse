<script setup lang="ts">
import { defineComponent, ref } from 'vue-demi'
import { onStartTyping } from '.'

const input = ref<HTMLInputElement | null>(null)

onStartTyping(() => {
  // @ts-ignore
  if (!input.value?.active)
    input.value!.focus()
})
</script>

<template>
  <div>
    <input ref="input" type="text" placeholder="Start typing to focus">
    <input type="text" placeholder="Start typing has no effect here">
  </div>
</template>
