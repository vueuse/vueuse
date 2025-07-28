<script setup lang="ts">
import { promiseTimeout, useTimeoutPoll } from '@vueuse/core'
import { shallowRef } from 'vue'

const count = shallowRef(0)

async function fetchData() {
  await promiseTimeout(1000)
  count.value++
}

const { isActive, pause, resume } = useTimeoutPoll(fetchData, 1000)
</script>

<template>
  <div>
    <div>Count: {{ count }}</div>
    <div>isActive: {{ isActive }}</div>
    <div>
      <button @click="pause">
        pause
      </button>
      <button @click="resume">
        resume
      </button>
    </div>
  </div>
</template>
