<script setup lang="ts">
import { ref } from 'vue-demi'
import { timestamp, useCountDown } from '@vueuse/core'
import { UseCountDown as CountDown } from './component'
const t1 = timestamp() + 30000
const isFinished = ref(false)
const onEnd = () => isFinished.value = true

const t2 = new Date(
  new Date(new Date().toLocaleDateString()).getTime()
          + 24 * 60 * 60 * 1000
          - 1,
)

const { formatted } = useCountDown(t2)
</script>

<template>
  <div>
    <count-down v-slot="{formatted}" :date="t1" format="s" :on-end="onEnd">
      <p v-if="!isFinished">
        Countdown
        <em class="text-yellow-600"> {{ formatted.value }}</em> s
      </p>
      <p v-else class="text-gray-400">
        Countdown Over
      </p>
    </count-down>

    <p>Time remaining today :  <em class="text-red-400">{{ formatted }}</em> (HH:mm:ss)</p>
  </div>
</template>
