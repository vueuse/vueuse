<script setup lang="ts">
import { interval } from 'rxjs'
import { ref } from 'vue'
import { useSubscription } from '.'

const count = ref(0)
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
