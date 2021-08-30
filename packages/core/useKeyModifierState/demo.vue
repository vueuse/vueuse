<script setup lang="ts">
import Key from '../useMagicKeys/Key.vue'
import { useKeyModifierState } from '.'

const capsLock = useKeyModifierState('CapsLock')
const numLock = useKeyModifierState('NumLock')
const scrollLock = useKeyModifierState('ScrollLock')
const shift = useKeyModifierState('Shift')
const control = useKeyModifierState('Control')
const alt = useKeyModifierState('Alt')
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
