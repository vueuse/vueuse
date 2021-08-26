<script setup lang="ts">
import { useModifierState } from '.'

const capsLock = useModifierState('CapsLock')
const numLock = useModifierState('NumLock')
const control = useModifierState('Control')
</script>

<template>
    Caps Lock: {{ capsLock }}
    <br />
    Num Lock: {{ numLock }}
    <br />
    Control: {{ control }}
</template>
    