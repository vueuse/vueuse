<script setup lang="ts">
import { effect, ref } from 'vue-demi'
import { useCountDown } from '.'

const countdown = ref(24 * 60 * 60 * 1000)

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

effect(() => {
  reset(countdown.value)
})
</script>

<template>
  <div>
    <div>
      countdown:
      <input v-model="countdown" type="number" />
    </div>
    <div>{{ formatted }}</div>
    <div>
      <button @click="start()">
        start
      </button>
      <button @click="pause()">
        pause
      </button>
      <button @click="reset(countdown)">
        reset
      </button>
    </div>
  </div>
</template>
