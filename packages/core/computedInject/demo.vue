<script setup lang="ts">
import { provide, ref } from 'vue'
import Receiver, { ArrayKey } from './demoReceiver.vue'

const array = ref([{ key: 1, value: '1' }, { key: 2, value: '2' }, { key: 3, value: '3' }])

provide(ArrayKey, array)
</script>

<template>
  <div grid md:grid-cols-2 grid-cols-1 gap-4>
    <div md:border="0 r-1 dark:(black opacity-50)">
      <div text-primary font-bold mb-2>
        Array
      </div>
      <pre>{{ array }}</pre>
    </div>
    <Receiver />
  </div>
</template>
