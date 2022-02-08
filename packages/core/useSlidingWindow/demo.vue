<script setup lang="ts">
import { computed, ref } from 'vue-demi'
import { useSlidingWindow } from '.'

const start = ref(0)
const size = ref(10)
const end = computed(() => start.value + size.value)
const min = ref(0)
const max = ref(100)

const range = useSlidingWindow(
  min,
  max,
  start,
  end,
)

</script>

<template>
  <div>
    <div>Start & End: [{{ start }}, {{ end }}]</div>
    <div>Sliding Window: [{{ range[0] }}, {{ range[1] }}]</div>
    <div>
      <input id="start" v-model.number="start" type="range" min="-20" max="100">
      <label for="start">Start: {{ start }}</label>
    </div>
    <div>
      <input id="size" v-model.number="size" type="range" min="0" max="20">
      <label for="size">Size: {{ size }}</label>
    </div>
    <div>
      <input id="min" v-model.number="min" type="range" min="0" max="30">
      <label for="min">Min: {{ min }}</label>
    </div>
    <div>
      <input id="max" v-model.number="max" type="range" min="70" max="100">
      <label for="max">Max: {{ max }}</label>
    </div>
  </div>
</template>
