<script setup lang="ts">
import { useTitleTemplate } from '.'

const title = useTitleTemplate(null, '%s | My Awesome Website')
</script>

<template>
  <note>Title</note>
  <input v-model="title" type="text">
</template>
