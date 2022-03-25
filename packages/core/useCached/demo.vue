<script setup lang="ts">
import { ref } from 'vue'
import { useCached } from '@vueuse/core'

interface Value {
  value: number
  extra: number
}

const value = ref<Value>({ value: 42, extra: 0 })
const comparator = (a: Value, b: Value) => a.value === b.value
const cachedValue = useCached(value, comparator)

const inputValue = ref(value.value.value)
const inputExtra = ref(value.value.extra)

const onSyncClick = () => {
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
        <input id="localValue" v-model.number="inputValue">
      </div>
      <div>
        <label for="localExtra">Local Extra: </label>
        <input id="localExtra" v-model.number="inputExtra">
      </div>
      <div>
        <button @click="onSyncClick">
          Sync
        </button>
      </div>
    </div>
  </div>
</template>
