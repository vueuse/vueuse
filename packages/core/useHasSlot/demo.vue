<script setup lang="ts">
import { useHasSlot } from '@vueuse/core'

const hasSlot = useHasSlot()
const hasFooSlot = hasSlot('foo')
</script>

<template>
  <div>
    <div>Foo Slot is {{ hasFooSlot ? 'Exist' : 'Not Exist' }}</div>
    <slot name="foo" />
  </div>
</template>
