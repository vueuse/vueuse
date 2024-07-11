<script setup lang="ts">
import { ref } from 'vue-demi'
import { useElementOverflow } from './index'

const overflowRef = ref()
const { isXOverflowed } = useElementOverflow(overflowRef, { observeMutation: true })
const input = ref('some words here')
const width = ref(200)
</script>

<template>
  <div>
    <div>content:</div>
    <input v-model="input" type="text">
    <div>width:</div>
    <input v-model.number="width" type="range" min="0" step="1" max="200">
    <div>display:</div>
    <div ref="overflowRef" :style="`width: ${width}px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;`">
      <b>{{ input }}</b>
    </div>
    <br>
    <div>
      isOverflowed: <boolean-display :value="isXOverflowed">
        {{ isXOverflowed }}
      </boolean-display>
    </div>
  </div>
</template>
