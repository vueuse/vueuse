<script setup lang="ts">
import Key from '../useMagicKeys/Key.vue'
import { useKeyModifier } from '.'

const capsLock = useKeyModifier('CapsLock')
const numLock = useKeyModifier('NumLock')
const scrollLock = useKeyModifier('ScrollLock')
const shift = useKeyModifier('Shift')
const control = useKeyModifier('Control')
const alt = useKeyModifier('Alt')
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-2">
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
