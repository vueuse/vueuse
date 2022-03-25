<script setup lang="ts">
import { ref, watch } from 'vue'
import { useWindowFocus } from '@vueuse/core'

const startMessage = '💡 Click somewhere outside of the document to unfocus.'
const message = ref(startMessage)
const focused = useWindowFocus()

watch(focused, (isFocused) => {
  if (isFocused)
    message.value = startMessage
  else
    message.value = 'ℹ Tab is unfocused'
})
</script>

<template>
  <div>{{ message }}</div>
</template>
