<script lang="ts" setup>
import { ref } from '@vue/reactivity'
import { useCounter } from '@vueuse/shared'
import dayjs from 'dayjs'
import type { Ref } from 'vue-demi'
import { useDebouncedRefHistory } from '.'

const format = (ts: number) => dayjs(ts).format()
const delay: Ref<number> = ref(1000)

const { count, inc, dec } = useCounter()
const { history, undo, redo, canUndo, canRedo } = useDebouncedRefHistory(
  count, { capacity: 10, debounce: delay },
)
</script>

<template>
  <div>Count: {{ count }}</div>
  <button @click="inc()">
    Increment
  </button>
  <button @click="dec()">
    Decrement
  </button>
  <span class="ml-2">/</span>
  <button :disabled="!canUndo" @click="undo()">
    Undo
  </button>
  <button :disabled="!canRedo" @click="redo()">
    Redo
  </button>
  <br>
  <span>Delay (in ms):</span>
  <input v-model="delay" type="number">
  <br>
  <br>
  <note>History (limited to 10 records for demo)</note>
  <div class="code-block mt-4">
    <div v-for="i in history" :key="i.timestamp">
      <span class="opacity-50 mr-2 font-mono">{{ format(i.timestamp) }}</span>
      <span class="font-mono">{ value: {{ i.snapshot }} }</span>
    </div>
  </div>
</template>
