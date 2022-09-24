<script setup lang="ts">
import { ref } from 'vue'
import { useTimeoutFn } from '@vueuse/core'

const defaultText = 'Please wait for 3 seconds'
const text = ref(defaultText)
const { start, isPending } = useTimeoutFn(() => {
  text.value = 'Fired!'
}, 3000)

const restart = () => {
  text.value = defaultText
  start()
}
</script>

<template>
  <p>{{ text }}</p>
  <button :class="{ disabled: isPending }" @click="restart()">
    Restart
  </button>
</template>
