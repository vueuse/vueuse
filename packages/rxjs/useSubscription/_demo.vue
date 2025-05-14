<script setup lang="ts">
import { useSubscription } from '@vueuse/rxjs'
import { interval } from 'rxjs'
import { shallowRef } from 'vue'

const count = shallowRef(0)
useSubscription(
  interval(1000)
    .subscribe(() => {
      count.value++
    }),
)
</script>

<template>
  <note>Update every 1s</note>
  <p>Counter: {{ count }}</p>
</template>
