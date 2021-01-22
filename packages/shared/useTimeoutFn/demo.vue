<script setup lang="ts">
import { ref } from 'vue-demi'
import { useTimeoutFn } from '.'

const defaultText = 'Please wait for 3 seconds'
const text = ref(defaultText)
const { start, isActive } = useTimeoutFn(() => {
  text.value = 'Fired!'
}, 3000)

const restart = () => {
  text.value = defaultText
  start()
}
</script>

<template>
  <p>{{ text }}</p>
  <button :class="{disabled: isActive}" @click="restart()">
    Restart
  </button>
</template>
