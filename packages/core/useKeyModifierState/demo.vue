<script setup lang="ts">
import { useKeyModifierState } from '.'

const capsLock = useKeyModifierState('CapsLock')
const numLock = useKeyModifierState('NumLock')
const control = useKeyModifierState('Control')
</script>

<template>
  Caps Lock: {{ capsLock }}
  <br />
  Num Lock: {{ numLock }}
  <br />
  Control: {{ control }}
</template>
