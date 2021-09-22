<script setup lang="ts">
import { VueUseFunction } from '../../../../meta/types'

defineProps<{ fn: VueUseFunction }>()

function parseMarkdown(markdownText = '') {
  const htmlText = markdownText
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
    .replace(/\*\*(.*)\*\*/gim, '<b>$1</b>')
    .replace(/\*(.*)\*/gim, '<i>$1</i>')
    .replace(/!\[(.*?)\]\((.*?)\)/gim, '<img alt=\'$1\' src=\'$2\' />')
    .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href=\'$2\'>$1</a>')
    .replace(/`(.*?)`/gim, '<code>$1</code>')
    .replace(/\n$/gim, '<br />')

  return htmlText.trim()
}
</script>

<template>
  <div text="sm" class="whitespace-nowrap overflow-hidden overflow-ellipsis">
    <a :href="`/${fn.package}/${fn.name}`" bg="gray-400/5" p="x-2 y-0.5">{{ fn.name }}</a>
    -
    <span class="overflow-hidden overflow-ellipsis" v-html="parseMarkdown(fn.description)"></span>
  </div>
</template>
