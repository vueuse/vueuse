<script setup lang="ts">
import { computed } from 'vue'

import { useTextDirection } from '.'

const dir = useTextDirection({
  selector: '#_useTextDirectionDemo',
})
const text = computed(() =>
  dir.value === 'ltr'
    ? 'This paragraph is in English and correctly goes left to right.'
    : 'This paragraph is in English but incorrectly goes right to left.')

function handleOnClick() {
  dir.value = dir.value === 'rtl' ? 'ltr' : 'rtl'
}
</script>

<template>
  <div id="_useTextDirectionDemo">
    <p>
      {{ text }}
    </p>
    <hr>
    <button @click="handleOnClick">
      <span class="ml-2">{{ dir.toUpperCase() }}</span>
    </button>
    <span class="p-4 opacity-50">Click to change the direction</span>
  </div>
</template>

<style scoped>
#_useTextDirectionDemo[dir='rtl']
p {
  color: red;
}
button {
  margin-right: 0.5em;
}
</style>
