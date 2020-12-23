<script setup lang="ts">
import dayjs from 'dayjs'
import { useManualRefHistory } from '.'
import { useCounter } from '..'

const format = (ts: number) => dayjs(ts).format()

const { inc, dec, count } = useCounter()
const { canUndo, canRedo, history, commit, undo, redo } = useManualRefHistory(count, { capacity: 10 })
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
    <button @click="inc()">
      Increment
    </button>
    <button @click="dec()">
      Decrement
    </button>
    <span class="mx-2">/</span>
    <button @click="commit()">
      Commit
    </button>
    <button :disabled="!canUndo" @click="undo()">
      Undo
    </button>
    <button :disabled="!canRedo" @click="redo()">
      Redo
    </button>
    <br>
    <note>History (limited to 10 records for demo)</note>
    <div class="ml-2">
      <div v-for="i in history" :key="i.timestamp">
        <span class="opacity-50 mr-3 font-mono">{{ format(i.timestamp) }}</span>
        <span class="font-mono">{ value: {{ i.snapshot }} }</span>
      </div>
    </div>
  </div>
</template>
