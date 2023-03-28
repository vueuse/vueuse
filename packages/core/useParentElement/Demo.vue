<script lang="ts" setup>
import { useParentElement } from '@vueuse/core'

const parentElement = useParentElement()
</script>

<template>
  <p>Parent element tag: {{ parentElement ? parentElement.tagName : 'Finding...' }}</p>
</template>
