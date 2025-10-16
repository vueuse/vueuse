<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import { useMicroLoader } from '.'
import CustomLoaderDemo from './components/CustomLoaderDemo.vue'

const quickTaskStatus = shallowRef<'idle' | 'pending' | 'done'>('idle')
const slowTaskStatus = shallowRef<'idle' | 'pending' | 'done'>('idle')

const taskDuration = shallowRef(500)
const minLoadingTime = shallowRef(2000)
const quickLoadingThreshold = shallowRef(1000)

const customLoaderKey = computed(() =>
  `${taskDuration.value}-${minLoadingTime.value}-${quickLoadingThreshold.value}`,
)

const isQuickLoading = useMicroLoader(() => quickTaskStatus.value === 'pending')
const isSlowLoading = useMicroLoader(() => slowTaskStatus.value === 'pending')

async function simulateQuickTask() {
  quickTaskStatus.value = 'pending'
  await new Promise(resolve => setTimeout(resolve, 200))
  quickTaskStatus.value = 'done'
}

async function simulateSlowTask() {
  slowTaskStatus.value = 'pending'
  await new Promise(resolve => setTimeout(resolve, 1500))
  slowTaskStatus.value = 'done'
}
</script>

<template>
  <div>
    <div>
      <h3>Quick Task (200ms)</h3>
      <p>Loading state: {{ isQuickLoading ? 'Loading...' : 'Not Loading' }}</p>
      <button
        :disabled="quickTaskStatus === 'pending'"
        @click="simulateQuickTask"
      >
        Run Quick Task
      </button>
      <p>Note: Loading indicator won't show due to quick execution</p>
    </div>

    <div>
      <h3>Slow Task (1500ms)</h3>
      <p>Loading state: {{ isSlowLoading ? 'Loading...' : 'Not Loading' }}</p>
      <button
        :disabled="slowTaskStatus === 'pending'"
        @click="simulateSlowTask"
      >
        Run Slow Task
      </button>
      <p>Note: Loading indicator will show due to slow execution</p>
    </div>

    <div>
      <h3>Custom Configuration</h3>
      <div>
        <label>
          Task Duration (ms):
          <input
            v-model="taskDuration"
            type="number"
            min="0"
            step="100"
          >
        </label>
      </div>
      <div>
        <label>
          Min Loading Time (ms):
          <input
            v-model="minLoadingTime"
            type="number"
            min="0"
            step="100"
          >
        </label>
      </div>
      <div>
        <label>
          Quick Loading Threshold (ms):
          <input
            v-model="quickLoadingThreshold"
            type="number"
            min="0"
            step="100"
          >
        </label>
      </div>

      <CustomLoaderDemo
        :key="customLoaderKey"
        :task-duration="taskDuration"
        :min-loading-time-ms="minLoadingTime"
        :quick-loading-threshold-ms="quickLoadingThreshold"
      />
    </div>
  </div>
</template>
