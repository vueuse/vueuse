<script setup lang="ts">
import type { VueUseFunction } from '../../../../meta/types'
import { renderMarkdown } from '../utils'

defineProps<{ fn: VueUseFunction }>()

function styledName(name: string) {
  if (name.startsWith('use'))
    return `<span opacity="70">use</span>${name.slice(3)}`
  if (name.startsWith('try'))
    return `<span opacity="70">try</span>${name.slice(3)}`
  if (name.startsWith('on'))
    return `<span opacity="70">on</span>${name.slice(2)}`
  return name
}
</script>

<template>
  <div text="sm" class="whitespace-nowrap overflow-hidden overflow-ellipsis">
    <a :href="`/${fn.package}/${fn.name}/`" bg="gray-400/5" p="x-1.5 y-0.5" class="rounded" v-html="styledName(fn.name)" />
    -
    <span class="overflow-hidden overflow-ellipsis" v-html="renderMarkdown(fn.description)" />
  </div>
</template>
