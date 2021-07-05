<script setup lang="ts">
import { provide, ref } from 'vue-demi'
import Receiver, { ArrayKey } from './demoReceiver.vue'

const array = ref([{ key: 1, value: '1' }, { key: 2, value: '2' }, { key: 3, value: '3' }])

provide(ArrayKey, array)
</script>

<template>
  <div>
    <p>Array: {{ array }}</p>
    <Receiver />
  </div>
</template>
