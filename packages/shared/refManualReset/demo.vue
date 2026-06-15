<script setup lang="ts">
import { refManualReset } from '@vueuse/core'

const message = refManualReset('Default message')

function setMessage() {
  message.value = 'Changed'
}
function resetMessage() {
  message.reset()
}
</script>

<template>
  <div>
    <input v-model="message" type="text">
    <button @click="setMessage()">
      Change Message
    </button>
    <button @click="resetMessage()">
      Reset Message
    </button>
  </div>
</template>
