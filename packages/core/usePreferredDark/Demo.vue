<script setup lang="ts">
import { defineComponent } from 'vue-demi'
import { usePreferredDark } from '.'

const prefersDark = usePreferredDark()
</script>

<template>
  <div>
    <p>Prefers Dark: {{ prefersDark.toString() }}</p>
  </div>
</template>
