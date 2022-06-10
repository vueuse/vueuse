<script setup lang="ts">
import { computed, onUnmounted } from 'vue'

import { useDir } from './index'

const dir = useDir({
  selector: '#_useDirDemo',
})
const text = computed(() =>
  dir.value === 'ltr'
    ? 'This paragraph is in English and correctly goes left to right.'
    : 'This paragraph is in English but incorrectly goes right to left.',
)

const handleOnClick = () => {
  dir.value = dir.value === 'rtl' ? 'lrt' : 'rtl'
}
</script>

<template>
  <div id="_useDirDemo">
    <p>
      {{ text }}
    </p>
    <hr>
    <button @click="handleOnClick">
      <span class="ml-2">{{ dir.toUpperCase() }}</span>
    </button>
    <span class="p-4 opacity-50">Click to change the direaction</span>
  </div>
</template>

<style scoped>
#_useDirDemo[dir='rtl']
p {
  color: red;
}
button {
  margin-right: 0.5em;
}
</style>
