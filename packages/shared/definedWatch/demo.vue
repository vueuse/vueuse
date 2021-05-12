<script setup lang="ts">
import { ref } from 'vue-demi'
import { definedWatch } from '.'

const input = ref<string | number | null | undefined>(null)
const updated = ref(0)
const latest = ref<string | number>('')

definedWatch(input, (value) => {
  updated.value += 1
  latest.value = value
  console.log('changed!')
})
</script>

<template>
  <div>
    <input v-model="input" placeholder="Try to type anything..." type="text">
    <button @click="input = null">
      Set to null
    </button>
    <button @click="input = undefined">
      Set to undefined
    </button>
    <button @click="input = ''">
      Set to empty string
    </button>
    <button @click="input = 0">
      Set to zero
    </button>
    <button @click="input = 'demo'">
      Set to 'demo'
    </button>

    <p>Input: {{ JSON.stringify(input) }}</p>
    <p>Latest: {{ JSON.stringify(latest) }}</p>
    <p>Times Updated: {{ updated }}</p>
  </div>
</template>
