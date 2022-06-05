<script setup lang="ts">
import { useHistoryState } from '@vueuse/core'

const count = useHistoryState('count', 0)

function reload() {
  location.reload()
}
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
    <button @click="count++">
      Increment
    </button>
    <button @click="reload">
      Reload
    </button>
  </div>
</template>
