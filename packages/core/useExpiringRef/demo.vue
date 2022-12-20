<script setup lang="ts">
import { ref } from 'vue-demi'
import { useExpiringRef } from '@vueuse/core'

const newValue = ref<any>('foo')
const newMs = ref<number>(3000)
const [val, setMs] = useExpiringRef(newMs.value)
</script>

<template>
  <div>
    <p>Value: {{ val }}</p>
    <input v-model="newValue" placeholder="value" class="mr-2 rounded-sm">
    <button @click="val = newValue">
      Update Value
    </button>
  </div>
  <div>
    <p>Set timeout:</p>
    <input v-model.number="newMs" placeholder="ms" class="mr-2 rounded-sm">
    <button @click="setMs(newMs)">
      Update Timeout
    </button>
  </div>
</template>

<style scoped>
input {
  background-color: #313131;
  padding: .4em;
}
</style>
