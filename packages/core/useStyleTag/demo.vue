<script setup lang="ts">
import { useStyleTag } from '.'

const { id, css, load, unload, loaded } = useStyleTag('.usestyle-demo { margin-top: 32px; }')
</script>

<template>
  <p>
    Edit CSS:
    <textarea v-model="css" type="text" rows="2" class="w-full" />
  </p>
  <button @click="load">
    Load
  </button>
  <button class="orange" :disabled="!loaded" @click="unload">
    Unload
  </button>
  <div class="usestyle-demo">
    <p>Id: <code>{{ id }}</code></p>
    <p>Status: <span :class="[loaded ? 'bg-green-500' : 'bg-[#db8742]']" class="py-1 px-2 rounded text-white">{{ loaded ? "Loaded" : "Unloaded" }}</span></p>
  </div>
</template>
