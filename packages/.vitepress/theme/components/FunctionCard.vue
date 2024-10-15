<script setup lang="ts">
import type { VueUseFunction } from '@vueuse/metadata'
import { defineAsyncComponent, h } from 'vue'

import { renderMarkdown } from '../utils'

const props = defineProps<{ fn: VueUseFunction }>()

async function safeImport(path: string) {
  try {
    return await /* @vite-ignore */ import(path)
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
    <div w-full h-auto>
      <DemoCard flex-grow h-sm>
        <Demo />
      </DemoCard>
    </div>
    <span class="whitespace-wrap" v-html="renderMarkdown(fn.name)" />
  </div>
</template>
