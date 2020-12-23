<script setup lang="ts">
import { defineComponent, ref, computed } from 'vue-demi'
import { useMousePressed } from '.'
import { useToggle } from '@vueuse/shared/useToggle'

const el = ref(null)
      const [withTarget, toggle] = useToggle()
      const target = computed(() => {
        if (withTarget.value)
          return el.value
        return window
      })
      const el,
        withTarget,
        toggle,
        ...useMousePressed({ target }),
</script>

<template>
  <div ref="el" class="select-none">
    <pre>Pressed: {{ pressed }}</pre>
    <pre>Source Type: {{ JSON.stringify(sourceType) }}</pre>
    <br />
    <span @click="toggle" class="mt-4 underline cursor-pointer">{{
      withTarget ? 'Tracking on this Demo section' : 'Tracking on Window'
    }}</span>
  </div>
</template>
