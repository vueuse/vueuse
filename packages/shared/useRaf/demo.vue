<script setup lang="ts">
import { useRaf } from '@vueuse/core'
import { ref } from 'vue-demi'

const executed = ref(0)
const requests = ref(0)

const callback = () => executed.value++

const normal = useRaf(callback, { debounce: false })
const debounced = useRaf(callback, { debounce: true })

function start(raf: ReturnType<typeof useRaf>, count = 1000) {
  for (let i = 0; i < count; i++) {
    // Don't block main thread
    setTimeout(() => {
      requests.value++
      raf.request()
    }, 0)
  }
}

function reset() {
  normal.cancel()
  debounced.cancel()

  executed.value = 0
  requests.value = 0
}
</script>

<template>
  <div>
    <p>Executed {{ executed }} out of {{ requests }} requests</p>
    <button @click="start(normal)">
      Normal
    </button>
    <button @click="start(debounced)">
      Debounced
    </button>
    <button @click="reset()">
      Reset
    </button>
  </div>
</template>
