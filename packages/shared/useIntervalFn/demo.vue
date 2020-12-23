<script setup lang="ts">
import { defineComponent, ref } from 'vue-demi'
import { useIntervalFn } from '.'

const greetings = ['Hello', 'Hi', 'Yo!', 'Hey', 'Hola', 'こんにちは', 'Bonjour', 'Salut!', '你好']
      const word = ref('Hello')

      const word,
        ...useIntervalFn(() => {
          word.value = greetings[Math.round(Math.random() * (greetings.length - 1))]
        }, 500),
</script>

<template>
  <div>
    <p>{{ word }}</p>
    <button @click="pause" class="orange" v-if="isActive">Pause</button>
    <button @click="resume" v-if="!isActive">Resume</button>
  </div>
</template>
