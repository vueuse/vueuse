<script setup lang="ts">
import { useTimeoutFn } from '@vueuse/core'
import { shallowRef } from 'vue'

const defaultText = 'Please wait for 3 seconds'
const text = shallowRef(defaultText)
const { start, isPending } = useTimeoutFn(() => {
  text.value = 'Fired!'
}, 3000)

function restart() {
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
