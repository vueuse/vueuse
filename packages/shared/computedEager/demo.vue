<script setup lang="ts">
import { ref } from 'vue'
import { count } from './demo/state'
import LazyDemo from './demo/LazyDemo.vue'
import EagerDemo from './demo/EagerDemo.vue'

const lazyRenders = ref(0)
const eagerRenders = ref(0)
</script>

<template>
  <div grid grid-cols-2>
    <div>
      <span text-primary font-bold>Lazy Computed</span>
      <div font-mono>
        <LazyDemo @update="lazyRenders++" />
        <div>
          Renders: {{ lazyRenders }}
        </div>
      </div>
    </div>
    <div>
      <span text-primary font-bold>Eager Computed</span>
      <div font-mono>
        <EagerDemo @update="eagerRenders++" />
        <div>Renders: {{ eagerRenders }}</div>
      </div>
    </div>
  </div>

  <div mt-4 font-mono>
    Count: {{ count }}
  </div>
  <button secondary @click="count--">
    Decrement
  </button>
  <button @click="count++">
    Increment
  </button>
</template>
