<script setup lang="ts">
import type { VueUseFunction } from '@vueuse/metadata'
import { defineAsyncComponent, h } from 'vue'

import { renderMarkdown } from '../utils'

const props = defineProps<{ fn: VueUseFunction }>()

async function safeImport(path: string) {
  try {
    return await import(/* @vite-ignore */ path)
  }
  catch {
    return h('div', 'No Demo')
  }
}

const Demo = defineAsyncComponent({

  loader: () => safeImport(`../../../core/${props.fn.name}/demo.vue`),
  loadingComponent: () => h('div', 'loading...'),
  errorComponent: () => h('div', 'Error...'),
})
</script>

<template>
  <div
    text="sm" flex="~ col gap1 justify-between" items-center p-4
    :class="fn.deprecated ? 'op80 saturate-0' : ''"
  >
    <div w-full h-auto class="demo-container">
      <DemoCard flex-grow h-xs overflow-hidden>
        <Demo />
      </DemoCard>
    </div>
    <span class="whitespace-wrap" v-html="renderMarkdown(fn.name)" />
  </div>
</template>

<style lang="css" scoped>
.demo-container {
  width: 100%;
  font-size: var(--vt-doc-code-font-size);
  background: var(--vp-code-block-bg);
  position: relative;
  margin-bottom: 10px;
  border-radius: 8px;
  transition: background-color 0.5s;
}
</style>
