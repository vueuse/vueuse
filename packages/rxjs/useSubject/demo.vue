<script setup lang="ts">
import { tryOnScopeDispose } from '@vueuse/shared'
import { BehaviorSubject } from 'rxjs'
import { watch } from 'vue-demi'
import { useSubject } from '.'

const countSubject = new BehaviorSubject(0)
const count = useSubject(countSubject)

// eslint-disable-next-line no-console
watch(count, value => console.info('from watcher:', value))

// eslint-disable-next-line no-console
const subscription = countSubject.subscribe(value => console.info('from subscriber: ', value))
tryOnScopeDispose(() => { subscription.unsubscribe() })
</script>

<template>
  <button @click="count++">
    count is: {{ count }}
  </button>
</template>
