<script setup lang="ts">
import { tryOnScopeDispose } from '@vueuse/shared'
import { BehaviorSubject } from 'rxjs'
import { onMounted, watch } from 'vue'
import { useSubject } from '.'

const countSubject = new BehaviorSubject(0)
const count = useSubject(countSubject)

onMounted(() => {
  watch(count, value => console.info('from watcher:', value))

  const subscription = countSubject.subscribe(value => console.info('from subscriber: ', value))
  tryOnScopeDispose(() => {
    subscription.unsubscribe()
  })
})
</script>

<template>
  <button @click="count++">
    count is: {{ count }}
  </button>
</template>
