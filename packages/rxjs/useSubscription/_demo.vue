<script setup lang="ts">
import { ref } from 'vue-demi'
import { useSubscription } from '.'
import { interval } from 'rxjs'

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
