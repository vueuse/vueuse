<script setup lang="ts">
import { useDocumentVisibility } from '@vueuse/core'
import { useTimeoutFn } from '@vueuse/shared'
import { shallowRef, watch } from 'vue'

const startMessage = '💡 Minimize the page or switch tab then return'
const message = shallowRef(startMessage)
const visibility = useDocumentVisibility()

const timeout = useTimeoutFn(() => {
  message.value = startMessage
}, 3000)

watch(visibility, (current, previous) => {
  if (current === 'visible' && previous === 'hidden') {
    message.value = '🎉 Welcome back!'
    timeout.start()
  }
})
</script>

<template>
  <div>{{ message }}</div>
</template>
