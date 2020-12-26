<script setup lang="ts">
import { ref, computed } from 'vue-demi'
import { useMousePressed } from '.'
import { useToggle } from '..'

const el = ref<Element | null>(null)
const [withTarget, toggle] = useToggle()
const target = computed<Element | null>(() => {
  if (withTarget.value)
    return el.value
  return window as any as Element
})

const { pressed } = useMousePressed({ target })
</script>

<template>
  <div ref="el" class="select-none">
    <pre>Pressed: {{ pressed }}</pre>
    <pre>Source Type: {{ JSON.stringify(sourceType) }}</pre>
    <br>
    <span class="mt-4 underline cursor-pointer" @click="toggle">
      {{ withTarget ? 'Tracking on this Demo section' : 'Tracking on Window' }}
    </span>
  </div>
</template>
