<script setup lang="ts">
import { useCached } from '@vueuse/core'
import { shallowRef } from 'vue'

interface Value {
  value: number
  extra: number
}

const value = shallowRef<Value>({ value: 42, extra: 0 })
function comparator(a: Value, b: Value) {
  return a.value === b.value
}
const cachedValue = useCached(value, comparator)

const inputValue = shallowRef(value.value.value)
const inputExtra = shallowRef(value.value.extra)

function onSyncClick() {
  value.value = {
    value: inputValue.value,
    extra: inputExtra.value,
  }
}
</script>

<template>
  <div>
    <div>
      <div>Value: {{ value.value }}</div>
      <div>Extra: {{ value.extra }}</div>
      <div>Cached Value: {{ cachedValue.value }}</div>
      <div>Cached Extra: {{ cachedValue.extra }}</div>

      <div>
        <label for="localValue">Temp Value: </label>
        <input id="localValue" v-model.number="inputValue" type="number">
      </div>
      <div>
        <label for="localExtra">Local Extra: </label>
        <input id="localExtra" v-model.number="inputExtra" type="number">
      </div>
      <div>
        <button @click="onSyncClick">
          Sync
        </button>
      </div>
    </div>
  </div>
</template>
