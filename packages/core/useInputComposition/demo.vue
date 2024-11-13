<script setup lang="ts">
import { useInputComposition } from './index'

const state = useInputComposition()
</script>

<template>
  <div>
    state: {{ state }}
    <input type="text">
  </div>
</template>
