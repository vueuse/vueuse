<script setup lang="ts">
import type { VueUseFunction } from '@vueuse/metadata'
import { defineAsyncComponent, h } from 'vue'

const props = defineProps<{ fn: VueUseFunction }>()

async function safeImport(fn: VueUseFunction) {
  try {
    if (fn.hasDemo) {
      return await import(/* @vite-ignore */ `../../../${props.fn.package}/${props.fn.name}/demo.vue`)
    }
    else {
      return await import(/* @vite-ignore */ `./NoDemo.vue`)
    }
  }
  catch {
    return h('div', 'Error...')
  }
}

const Demo = defineAsyncComponent({
  loader: () => safeImport(props.fn),
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
    <a class="cursor-pointer" :href="`/${fn.package}/${fn.name}`">{{ fn.name }}</a>
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
