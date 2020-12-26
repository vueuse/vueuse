<script setup lang="ts">
import { usePreferredLanguages } from '.'

const languages = usePreferredLanguages()
</script>

<template>
  <p>
    Preferred Languages: <code>{{ languages.join(', ') }}</code>
  </p>
</template>
