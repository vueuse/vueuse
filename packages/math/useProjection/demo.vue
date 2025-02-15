<script setup lang="ts">
import { ref as deepRef, shallowRef } from 'vue'
import { useProjection } from './index'

const from = deepRef<[number, number]>([0, 10])
const to = deepRef<[number, number]>([10, 100])
const input = shallowRef(0)

const output = useProjection(input, from, to)
</script>

<template>
  <div>
    <div>
      Projection from [{{ from[0] }}, {{ from[1] }}] to [{{ to[0] }}, {{ to[1] }}]
    </div>
    <div>
      <input id="input" v-model.number="input" type="range" :min="from[0]" :max="from[1]">
    </div>
    <div>
      Input: {{ input }}
    </div>
    <div>
      Output: {{ output }}
    </div>
  </div>
</template>
