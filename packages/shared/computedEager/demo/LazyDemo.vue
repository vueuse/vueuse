<script setup lang="ts">
import { computed, onUpdated } from 'vue-demi'
import { count } from './state'

const emit = defineEmits(['update'])
onUpdated(() => emit('update'))

const isOver10 = computed(() => count.value > 5)
</script>

<template>
  <div>
    Is over 5: <BooleanDisplay :value="isOver10" />
  </div>
</template>
