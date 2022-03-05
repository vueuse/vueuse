<script setup lang="ts">
import { useKeyModifier } from '@vueuse/core'
import Key from '../useMagicKeys/Key.vue'

const capsLock = useKeyModifier('CapsLock')
const numLock = useKeyModifier('NumLock')
const scrollLock = useKeyModifier('ScrollLock')
const shift = useKeyModifier('Shift')
const control = useKeyModifier('Control')
const alt = useKeyModifier('Alt')
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
    <Key :value="capsLock || false">
      capsLock
    </Key>
    <Key :value="numLock || false">
      numLock
    </Key>
    <Key :value="scrollLock || false">
      scrollLock
    </Key>
    <Key :value="shift || false">
      shift
    </Key>
    <Key :value="control || false">
      control
    </Key>
    <Key :value="alt || false">
      alt
    </Key>
  </div>
</template>
