<script setup lang="ts">
import { ref, watch } from 'vue-demi'
import { useDocumentVisibility } from '.'
import { useTimeoutFn } from '..'

const startMessage = 'Minimize this page or change the tab and return'
const message = ref(startMessage)
const visibility = useDocumentVisibility()

const timeout = useTimeoutFn(() => {
  message.value = startMessage
}, 3000)

watch(visibility, (current, previous) => {
  if (current === 'visible' && previous === 'hidden') {
    message.value = 'Welcome back!'
    timeout.start()
  }
})
</script>

<template>
  <h1>{{ message }}</h1>
</template>
