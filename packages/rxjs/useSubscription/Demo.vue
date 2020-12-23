<script setup lang="ts">
import { defineComponent, ref } from 'vue-demi'
import { useSubscription } from '../useSubscription'
import { interval } from 'rxjs'

const count = ref(0)
useSubscription(
  interval(1000).subscribe(() => {
    count.value++
  })
)
const count
</script>

<template>
  <div>
    <note>Update every 1s</note>
    <p>Counter: {{ count }}</p>
  </div>
</template>
