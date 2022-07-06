<script setup lang="ts">
import { ref } from 'vue'
import { useCssVar } from '@vueuse/core'

const el = ref(null)
const color = useCssVar('--color', el)

const switchColor = () => {
  if (color.value === '#df8543')
    color.value = '#7fa998'
  else
    color.value = '#df8543'
}

const elv = ref(null)
const key = ref('--color')
const colorVal = useCssVar(key, elv)
const changeVar = () => {
  if (key.value === '--color')
    key.value = '--color-one'
  else
    key.value = '--color'
}
</script>

<template>
  <div ref="el" style="--color: #7fa998; color: var(--color)">
    Sample text, {{ color }}
  </div>
  <button @click="switchColor">
    Change Color
  </button>
  <div ref="elv" style="--color: #7fa998; --color-one: #df8543;" :style="{ color: colorVal }">
    Sample text, {{ key }}: {{ colorVal }}
  </div>
  <button style="margin-left: 0;" @click="changeVar">
    Change Color Variable
  </button>
</template>
