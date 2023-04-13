<script setup lang="ts">
import { useStyleTag } from '@vueuse/core'

const customCSS = `
.demo { background: #ad4c2e50; }
.demo textarea { background: lightyellow; }
`.trim()

const { id, css, load, unload, isLoaded } = useStyleTag(customCSS)
</script>

<template>
  <div>
    Edit CSS:
    <textarea v-model="css" type="text" rows="2" class="w-full" />
  </div>
  <button :disabled="isLoaded" @click="load">
    Load
  </button>
  <button class="orange" :disabled="!isLoaded" @click="unload">
    Unload
  </button>
  <div class="usestyle-demo">
    <p>ID: <code>{{ id }}</code></p>
    <p>Loaded: <code>{{ isLoaded }}</code></p>
  </div>
</template>
