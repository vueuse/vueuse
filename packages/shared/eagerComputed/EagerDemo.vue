<script setup lang="ts">
import { onUpdated } from 'vue-demi'
import { count } from './state'
import { eagerComputed } from '.'

const emit = defineEmits(['update'])
onUpdated(() => emit('update'))

const isOver10 = eagerComputed(() => count.value > 5)
</script>

<template>
  <div>
    Is over 5: <BooleanDisplay :value="isOver10" />
  </div>
</template>
