<script setup lang="ts">
import { useWindowFocus } from '@vueuse/core'
import { shallowRef, watch } from 'vue'

const startMessage = '💡 Click somewhere outside of the document to unfocus.'
const message = shallowRef(startMessage)
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
