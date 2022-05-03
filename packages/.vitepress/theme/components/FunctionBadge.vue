<script setup lang="ts">
import { computed } from 'vue'
import type { VueUseFunction } from '../@vueuse/metadata'
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
  <div text="sm" class="whitespace-nowrap overflow-hidden overflow-ellipsis">
    <a v-bind="link" bg="gray-400/5" p="x-1.5 y-0.5" class="rounded items-center" flex="inline gap-1">
      <span v-html="styledName(fn.name)" />
      <i v-if="fn.external" i-carbon-launch class="opacity-80 text-xs" />
    </a>
    -
    <span class="overflow-hidden overflow-ellipsis" v-html="renderMarkdown(fn.description)" />
  </div>
</template>
