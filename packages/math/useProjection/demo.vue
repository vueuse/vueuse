<script setup lang="ts">
import { ref } from 'vue-demi'
import { useProjection } from '.'

const from = ref<[number, number]>([0, 10])
const to = ref<[number, number]>([10, 100])
const input = ref(0)

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
