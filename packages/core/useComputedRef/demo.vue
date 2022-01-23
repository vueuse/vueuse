<script setup lang="ts">
import { computed, onUpdated, ref } from 'vue-demi'
import { useComputedRef } from '.'

const stableValue = ref(1)
const stableIsOdd = useComputedRef(() => stableValue.value % 2 === 0)

const mutableValue = ref(1)
const mutableIsOdd = computed(() => mutableValue.value % 2 === 0)

onUpdated(() => {
  console.log('onUpdate')
})

const step = ref(2)

const onIncrStableIsOdd = () => {
  stableValue.value += step.value
}

const onIncrMutableIsOdd = () => {
  mutableValue.value += step.value
}

</script>

<template>
  <div>
    <div>stableIsOdd: {{ stableIsOdd }}</div>
    <div>mutableIsOdd: {{ mutableIsOdd }}</div>
    <div>
      <div>
        <label for="step">Incr Step: </label>
        <input id="step" v-model="step">
      </div>
      <button @click="onIncrStableIsOdd">
        Incr stable IsOdd
      </button>
      <button @click="onIncrMutableIsOdd">
        Incr mutable IsOdd
      </button>
    </div>
  </div>
</template>
