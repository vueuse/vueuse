<script setup lang="ts">
import { rand, useIntervalFn } from '@vueuse/core'
import { shallowRef } from 'vue'

const greetings = ['Hello', 'Hi', 'Yo!', 'Hey', 'Hola', 'こんにちは', 'Bonjour', 'Salut!', '你好', 'Привет']
const word = shallowRef('Hello')
const interval = shallowRef(500)

const { pause, resume, isActive } = useIntervalFn(() => {
  word.value = greetings[rand(0, greetings.length - 1)]
}, interval)
</script>

<template>
  <p>{{ word }}</p>
  <p>
    interval:
    <input v-model="interval" type="number" placeholder="interval">
  </p>
  <button v-if="isActive" class="orange" @click="pause">
    Pause
  </button>
  <button v-if="!isActive" @click="resume">
    Resume
  </button>
</template>
