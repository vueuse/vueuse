<script setup lang="ts">
import { useElementBySelector } from '@vueuse/core'

const el = useElementBySelector('body')
</script>

<template>
  <div>
    <p>Body width: {{ el.offsetWidth }}</p>
    <p>Body height: {{ el.offsetHeight }}</p>
  </div>
</template>
