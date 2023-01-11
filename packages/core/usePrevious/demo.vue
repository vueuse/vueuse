<script setup lang="ts">
import { usePrevious } from '@vueuse/core'
import { useCounter } from '@vueuse/shared'

const { count, inc, dec } = useCounter(0)
const prevCount = usePrevious(count)
</script>

<template>
  <div>
    <p>counter current value：{{ count }}</p>
    <p>counter previous value：{{ prevCount }}</p>
    <button @click="inc()">
      increase
    </button>
    <button class="ml-2" @click="dec()">
      decrease
    </button>
  </div>
</template>
