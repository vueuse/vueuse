<script setup lang="ts">
import { onUpdated } from 'vue-demi'
import { computedEager } from '../index'
import { count } from './state'

const emit = defineEmits(['update'])
onUpdated(() => emit('update'))

const isOver10 = computedEager(() => count.value > 5)
</script>

<template>
  <div>
    Is over 5: <BooleanDisplay :value="isOver10" />
  </div>
</template>
