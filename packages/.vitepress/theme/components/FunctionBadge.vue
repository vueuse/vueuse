<script setup lang="ts">
import type { VueUseFunction } from '@vueuse/metadata'
import { computed } from 'vue'
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
      v-bind="link"
      my-auto
      :class="fn.deprecated ? 'line-through !decoration-solid' : ''"
    >
      <code v-html="styledName(fn.name)" />
    </a>
    <i v-if="fn.external" i-carbon-launch class="opacity-50 text-0.7rem" />
    <span op50>-</span>
    <span class="whitespace-wrap" v-html="renderMarkdown(fn.description)" />
  </div>
</template>
