<script setup lang="ts">
import { useInputCompositionState } from './index'

const state = useInputCompositionState()
</script>

<template>
  <div>
    state: {{ state }}
    <input type="text">
  </div>
</template>
