<script setup lang="ts">
import { ref } from 'vue-demi'
import { useEventBus } from '.'

const { on, emit } = useEventBus<string>('vue-use-event-bus')
const message = ref('')
const news = [
  'Su Bingtian broke the Asian record and entered the Olympic 100-meter race finals as the first person in China-RTHK',
  'Comprehensive investigation in Zhengzhou to avoid further spread of the epidemic-RTHK',
  '130 stroke experts after vaccination: nothing to do with the vaccine',
  'Wu Yifan’s mobile phone was restored by the police to be involved in multiple crimes, if sentenced, he will serve his sentence in China',
  'China adds two gold medals in Olympic diving and weightlifting',
  'Tokyo Olympic service provokes athletes sleeping in cardboard suitcases and eating canned food, reviewing the Beijing Olympics god-level arrangements',
]
on(_message => message.value = news[Math.floor(Math.random() * news.length)])

const func = () => {}
func.www = '12312'
// eslint-disable-next-line accessor-pairs
Object.defineProperty(func, 'www', {
  writable: false,
})
console.log(func.www)
</script>

<template>
  <div style="display: flex; gap: 100px;">
    <div>
      <div>news channel:</div>
      <button @click="emit('The Tokyo Olympics has begun')">
        Broadcast news
      </button>
    </div>
    <div>
      <div style="margin-bottom: 13px;">
        television:
      </div>
      <div>{{ message || '--- no signal ---' }}</div>
    </div>
  </div>
</template>
