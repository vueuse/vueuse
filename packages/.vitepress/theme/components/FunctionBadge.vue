<script setup lang="ts">
import { computed } from 'vue'
import type { VueUseFunction } from '@vueuse/metadata'
import { renderMarkdown } from '../utils'

const props = defineProps<{ fn: VueUseFunction }>()

function styledName(name: string) {
  if (name.startsWith('use'))
    return `<span opacity="70">use</span>${name.slice(3)}`
  if (name.startsWith('try'))
    return `<span opacity="70">try</span>${name.slice(3)}`
  if (name.startsWith('on'))
    return `<span opacity="70">on</span>${name.slice(2)}`
  return name
}

const link = computed(() => {
  if (props.fn.external) {
    return {
      href: props.fn.external,
      target: '_blank',
    }
  }
  return {
    href: `/${props.fn.package}/${props.fn.name}/`,
  }
})
</script>

<template>
  <div
    text="sm" flex="~ gap1" items-center
    :class="fn.deprecated ? 'op80 saturate-0' : ''"
  >
    <a
      v-bind="link" bg="gray-400/5" p="x-1.5 y-0.5" class="rounded items-center" flex="inline gap-1 none" my-auto
      :class="fn.deprecated ? 'line-through !decoration-solid' : ''"
    >
      <span v-html="styledName(fn.name)" />
      <i v-if="fn.external" i-carbon-launch class="opacity-80 text-xs" />
    </a>
    <span op50>-</span>
    <span class="whitespace-wrap" v-html="renderMarkdown(fn.description)" />
  </div>
</template>
