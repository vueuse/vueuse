<script setup lang="ts">
import { defineComponent } from 'vue-demi'
import { usePreferredColorScheme } from '.'

const preferredColorScheme = usePreferredColorScheme()
</script>

<template>
  <div>
    <p>Preferred Color Scheme: {{ preferredColorScheme.toString() }}</p>
  </div>
</template>
