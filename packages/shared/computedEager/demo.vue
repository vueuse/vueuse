<script setup lang="ts">
import { computed, onUpdated, ref } from 'vue-demi'
import { computedEager } from '.'

const eagerValue = ref(1)
const eagerIsOdd = computedEager(() => eagerValue.value % 2 === 0)

const lazyValue = ref(1)
const lazyIsOdd = computed(() => lazyValue.value % 2 === 0)

onUpdated(() => {
  console.log('onUpdate')
})
const step = ref(2)
const onIncrEagerIsOdd = () => {
  eagerValue.value += step.value
}
const onIncrLazyIsOdd = () => {
  lazyValue.value += step.value
}
</script>

<template>
  <div>
    <div>eagerIsOdd: {{ eagerIsOdd }}</div>
    <div>lazyIsOdd: {{ lazyIsOdd }}</div>
    <div>
      <div>
        <label for="step">Incr value: </label>
        <input id="step" v-model.number="step">
      </div>
      <button @click="onIncrEagerIsOdd">
        Incr eager IsOdd
      </button>
      <button @click="onIncrLazyIsOdd">
        Incr lazy IsOdd
      </button>
    </div>
  </div>
</template>
