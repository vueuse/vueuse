<script setup lang="ts">
import { useResizeObserver } from '@vueuse/core'
import { shallowRef, useTemplateRef } from 'vue'

const el = useTemplateRef('el')
const text = shallowRef('')

useResizeObserver(el, (entries) => {
  const [entry] = entries
  const { width, height } = entry.contentRect
  text.value = `width: ${width}\nheight: ${height}`
})
</script>

<template>
  <note class="mb-2">
    Resize the box to see changes
  </note>
  <textarea ref="el" class="resizer" disabled v-text="text" />
</template>
