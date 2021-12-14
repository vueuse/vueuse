<script setup lang="ts">
import { effect, ref } from 'vue-demi'
import { useCountDown } from '.'

const countdown = ref(24 * 60 * 60 * 1000)

const { formatted, start, pause, reset } = useCountDown(24 * 60 * 60 * 1000, {
  millisecond: true,
  format: 'HH:mm:ss:SSS',
  onFinish: () => {
    console.log('finish')
  },
})
effect(() => {
  reset(countdown.value)
})

const t2 = new Date(
  new Date(new Date().toLocaleDateString()).getTime()
  + 24 * 60 * 60 * 1000
  - 1,
)

const { formatted: dateFormatted } = useCountDown(t2, {
  format: 'HH:mm:ss:SSS',
  millisecond: true,
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

    <div>dateFormatted: {{ dateFormatted }}</div>
  </div>
</template>
