<script setup lang="ts">
import { refAutoReset } from '@vueuse/core'

const message = refAutoReset('Default message', 1000)

function setMessage() {
  message.value = 'Changed'
}
</script>

<template>
  <div>
    <button @click="setMessage()">
      Change Message
    </button>
    <p>
      {{ message }}
    </p>
  </div>
</template>
