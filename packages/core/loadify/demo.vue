<script setup lang="ts">
import { ref } from 'vue-demi'
import axios from 'axios'
import YAML from 'js-yaml'
import { loadify } from './loadify.'

const isLoading = ref(false)
const state = ref({})
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const rawFetch = async(id: number) => {
  await delay(500)
  return await axios
    .get(`https://jsonplaceholder.typicode.com/todos/${id}`)
    .then(t => state.value = t.data)
}

const fetch = loadify(isLoading, rawFetch)
const clear = () => state.value = {}
</script>

<template>
  <div>
    <note>IsLoading: {{ isLoading.toString() }}</note>
    <pre lang="json" class="ml-2">{{ YAML.dump(state) }}</pre>
    <button :disabled="isLoading" @click="fetch(1)">
      Fetch Todo #1
    </button>
    <button :disabled="isLoading" @click="fetch(2)">
      Fetch Todo #2
    </button>
    <button :disabled="isLoading" @click="fetch(3)">
      Fetch Todo #3
    </button>
    <button :disabled="isLoading" @click="clear()">
      Clear
    </button>
    <button :disabled="isLoading" @click="rawFetch(4)">
      Raw Fetch
    </button>
  </div>
</template>
