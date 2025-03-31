<script setup lang="ts">
import { useDateFormat, useTimestamp, useWebWorkerFn } from '@vueuse/core'
import { computed, nextTick, shallowRef } from 'vue'

function heavyTask() {
  const randomNumber = () => Math.trunc(Math.random() * 5_000_00)
  const numbers: number[] = Array.from({ length: 5_000_000 }).fill(undefined).map(randomNumber)
  numbers.sort()
  return numbers.slice(0, 5)
}

const { workerFn, workerStatus, workerTerminate } = useWebWorkerFn(heavyTask)
const time = useTimestamp()
const computedTime = useDateFormat(time, 'YYYY-MM-DD HH:mm:ss SSS')
const running = computed(() => workerStatus.value === 'RUNNING')

const data = shallowRef<number[] | null>(null)
const runner = shallowRef('')

async function baseSort() {
  data.value = null
  await nextTick()
  data.value = heavyTask()
  runner.value = 'Main'
}

async function workerSort() {
  data.value = null
  await nextTick()
  data.value = await workerFn()
  runner.value = 'Worker'
}
</script>

<template>
  <p>Current Time: <b>{{ computedTime }}</b></p>
  <note class="mb-2">
    This is a demo showing sort for large array (5 million numbers) with or w/o WebWorker.<br>Clock stops when UI blocking happens.
  </note>
  <button @click="baseSort">
    Sort in Main Thread
  </button>
  <button v-if="!running" @click="workerSort">
    Sort in Worker
  </button>
  <button v-else class="orange" @click="workerTerminate('PENDING')">
    Terminate Worker
  </button>
  <p v-if="data">
    Thread: <strong>{{ runner }}</strong><br>
    Result: <strong>{{ data }}</strong>
  </p>
</template>
