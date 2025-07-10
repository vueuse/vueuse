<script setup lang="ts">
import { useElementBySelector } from '@vueuse/core'

const el = useElementBySelector('body')
</script>

<template>
  <div>
    <p>Tag: {{ el?.tagName }}</p>
    <p>Body height: {{ el?.offsetHeight }}</p>
  </div>
</template>
