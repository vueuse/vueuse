<script setup lang="ts">
import { ref } from 'vue-demi'
import { promiseTimeout } from '@vueuse/shared'
import { useTimeoutPoll } from '.'

const count = ref(0)

const fetchData = async() => {
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
