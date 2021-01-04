<script setup lang="ts">
import { usePreferredLanguages } from '.'

const languages = usePreferredLanguages()
</script>

<template>
  <div>Preferred Languages:</div>
  <div style="padding: 0.5rem 0;">
    <code v-for="lang in languages" :key="lang" style="margin-right: 0.5rem">{{ lang }}</code>
  </div>
</template>
