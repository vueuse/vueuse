<script setup lang="ts">
import { defineComponent, ref } from 'vue-demi'
import { useCssVar } from '.'

const el = ref(null)
const color = useCssVar('--color', el)

const switchColor = () => {
  if (color.value === '#df8543') color.value = '#7fa998'
  else color.value = '#df8543'
}
</script>

<template>
  <div>
    <p ref="el" style="--color: #7fa998; color: var(--color)">
      Sample text, {{ color }}
    </p>
    <button @click="switchColor">
      Switch Color
    </button>
  </div>
</template>
