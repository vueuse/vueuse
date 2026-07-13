<script setup lang="ts">
import { useScrollbarWidth } from '@vueuse/core'
import { useTemplateRef } from 'vue'

const el = useTemplateRef<HTMLDivElement>('el')
const scrollbarWidth = useScrollbarWidth(el)
</script>

<template>
  <div>
    <div
      ref="el"
      style="overflow: auto; height: 120px; border: 1px solid var(--vp-c-divider); padding: 8px;"
    >
      <div style="height: 400px;">
        Scrollable content — long enough to force a scrollbar.
      </div>
    </div>
    <p>Reactive scrollbar width: <code>{{ scrollbarWidth }}px</code></p>
    <p style="opacity: 0.7; font-size: 0.9em;">
      (Returns 0 on browsers with overlay scrollbars — Safari, mobile.)
    </p>
  </div>
</template>
