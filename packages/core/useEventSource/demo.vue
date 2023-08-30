<script lang="ts" setup>
import { ref } from 'vue-demi'
import { useEventSource } from '.'

const url = ref('https://sse.dev/test')
const messages = ref<string[]>([])
const res = useEventSource(url, {
  onMessage(es, e) {
    messages.value.push(e.data)
  },
})
</script>

<template>
  <div>
    <input v-model="url" type="text">
    status: {{ res.status.value }}
    <button :disabled="res.status.value !== 'CLOSED'" @click="res.open">
      open
    </button>
    <button :disabled="res.status.value !== 'OPEN'" @click="res.close">
      close
    </button>
    <pre>data: {{ res.data.value }}</pre>
    <pre>onMessages: {{ messages }}</pre>
  </div>
</template>

<style lang="scss"></style>
