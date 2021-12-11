<script setup lang="ts">
import { useCountDown } from '.'

const { formatted, start, pause, reset } = useCountDown({
  time: 24 * 60 * 60 * 1000,
  millisecond: true,
  format: 'HH:mm:ss:SSS',
  onFinish: () => {
    console.log('finish')
  },
  onChange: (time) => {
    console.log(time)
  },
})

</script>

<template>
  <div>
    <div>{{ formatted }}</div>
    <div>
      <button @click="start()">
        start
      </button>
      <button @click="pause()">
        pause
      </button>
      <button @click="reset()">
        reset
      </button>
    </div>
  </div>
</template>
