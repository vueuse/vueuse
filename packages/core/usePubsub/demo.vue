<script setup lang="ts">
import { ref } from 'vue-demi'
import { usePubsub } from '.'

const { subscribe, publish, unsubscribe } = usePubsub('vue-use-pubsub')
const name = ref('')
const token = subscribe((value) => {
  name.value = `name: ${value}`
  console.log(`name: ${value}`)
})
publish('Banana')
// name: Banana

unsubscribe(token)

publish('czech')
// no console.log
</script>

<template>
  <div>{{ name }}</div>
</template>
