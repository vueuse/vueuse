<script setup lang="ts">
import { usePrevious } from '@vueuse/core'
import { shallowRef } from 'vue'

const counter = shallowRef(0)
const previous = usePrevious(counter)

function increment() {
  counter.value++
}

increment()
</script>

<template>
  <div>
    <p>counter: {{ counter }}</p>
    <p>previous: {{ previous }}</p>
    <button @click="increment">
      +1
    </button>
  </div>
</template>
