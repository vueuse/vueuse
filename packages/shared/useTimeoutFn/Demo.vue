<script setup lang="ts">
import { defineComponent, ref } from 'vue-demi'
import { useTimeoutFn } from '.'

const defaultText = 'Please wait 3 seconds'
const text = ref(defaultText)
const { start } = useTimeoutFn(() => {
  text.value = 'Fired!'
}, 3000)

const restart = () => {
  text.value = defaultText
  start()
}

const restart, text
</script>

<template>
  <div>
    <p>{{ text }}</p>
    <button @click="restart()">Resetart</button>
  </div>
</template>
