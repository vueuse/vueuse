<script setup lang="ts">
import { ref } from 'vue'
import { useDelayedPromise } from '.'

const delay = ref(500)

const isExecuteDelayedPromisePending = ref<boolean>(false)
const isDelayedPromiseResolved = ref<boolean>(false)

const getPromise = () => new Promise<void>(resolve => setTimeout(resolve, 100))

async function executeDelayedPromise() {
  isExecuteDelayedPromisePending.value = true

  await useDelayedPromise(
    getPromise(), delay.value,
  )

  isDelayedPromiseResolved.value = true
  isExecuteDelayedPromisePending.value = false
}
</script>

<template>
  <div>
    <label for="delay">Minimum execution time (in ms):</label>
    <input id="delay" v-model="delay" type="number">

    <button :disabled="isDelayedPromiseResolved || isExecuteDelayedPromisePending" @click="executeDelayedPromise">
      Execute promise resolving in 100ms
    </button>

    <button :disabled="!isDelayedPromiseResolved || isExecuteDelayedPromisePending" @click="isDelayedPromiseResolved = false">
      Reset
    </button>

    <p v-if="isDelayedPromiseResolved">
      Delayed promise resolved!
    </p>
  </div>
</template>
