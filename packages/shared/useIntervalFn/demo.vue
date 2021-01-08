<script setup lang="ts">
import { ref } from 'vue-demi'
import { useIntervalFn } from '.'

const greetings = ['Hello', 'Hi', 'Yo!', 'Hey', 'Hola', 'こんにちは', 'Bonjour', 'Salut!', '你好']
const word = ref('Hello')

const { pause, resume, isActive } = useIntervalFn(() => {
  word.value = greetings[Math.round(Math.random() * (greetings.length - 1))]
}, 500)
</script>

<template>
  <p>{{ word }}</p>
  <button v-if="isActive" class="orange" @click="pause">
    Pause
  </button>
  <button v-if="!isActive" @click="resume">
    Resume
  </button>
</template>
