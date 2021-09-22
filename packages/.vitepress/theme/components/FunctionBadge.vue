<script setup lang="ts">
import { VueUseFunction } from '../../../../meta/types'
import { renderMarkdown } from '../utils'

defineProps<{ fn: VueUseFunction }>()
</script>

<template>
  <div text="sm" class="whitespace-nowrap overflow-hidden overflow-ellipsis">
    <a :href="`/${fn.package}/${fn.name}/`" bg="gray-400/5" p="x-2 y-0.5">{{ fn.name }}</a>
    -
    <span class="overflow-hidden overflow-ellipsis" v-html="renderMarkdown(fn.description)"></span>
  </div>
</template>
