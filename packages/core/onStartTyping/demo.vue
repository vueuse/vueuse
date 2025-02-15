<script setup lang="ts">
import { onStartTyping } from '@vueuse/core'
import { shallowRef } from 'vue'

const input = shallowRef<HTMLInputElement | null>(null)

onStartTyping(() => {
  if (input.value !== document.activeElement)
    input.value!.focus()
})
</script>

<template>
  <note>Type anything</note>
  <input ref="input" type="text" placeholder="Start typing to focus">
  <input type="text" placeholder="Start typing has no effect here">
</template>
