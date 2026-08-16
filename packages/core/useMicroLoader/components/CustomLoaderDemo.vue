<script setup lang="ts">
import { shallowRef } from 'vue'
import { useMicroLoader } from '../index'

const props = defineProps<{
  taskDuration: number
  minLoadingTimeMs: number
  quickLoadingThresholdMs: number
}>()

const customTaskStatus = shallowRef<'idle' | 'pending' | 'done'>('idle')
const startTime = shallowRef<number | null>(null)
const currentTime = shallowRef<number | null>(null)

const isCustomLoading = useMicroLoader(() => customTaskStatus.value === 'pending', {
  minLoadingTimeMs: props.minLoadingTimeMs,
  quickLoadingThresholdMs: props.quickLoadingThresholdMs,
})

async function simulateCustomTask() {
  customTaskStatus.value = 'pending'
  startTime.value = Date.now()

  const interval = setInterval(() => {
    currentTime.value = Date.now()
  }, 16)

  await new Promise(resolve => setTimeout(resolve, props.taskDuration))

  clearInterval(interval)
  customTaskStatus.value = 'done'
  startTime.value = null
  currentTime.value = null
}
</script>

<template>
  <div>
    <div>
      <p>Loading state: {{ isCustomLoading ? 'Loading...' : 'Not Loading' }}</p>
      <p v-if="startTime">
        Time elapsed: {{ ((currentTime || Date.now()) - startTime) / 1000 }}s
      </p>
    </div>

    <button
      :disabled="customTaskStatus === 'pending'"
      @click="simulateCustomTask"
    >
      Run Custom Task
    </button>
  </div>
</template>

<style scoped>

</style>
