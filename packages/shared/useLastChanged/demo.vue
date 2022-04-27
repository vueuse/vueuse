<script setup lang="ts">
import { timestamp, useLastChanged, useTimeAgo } from '@vueuse/core'
import { ref } from 'vue'

const input = ref('')
const ms = useLastChanged(input, { initialValue: timestamp() - 1000 * 60 * 5 })
const timeago = useTimeAgo(ms)
</script>

<template>
  <div>
    <input v-model="input" type="text" placeholder="Type anything...">
    <div>Last changed: <span class="text-primary">{{ timeago }}</span> <span class="opacity-50 font-mono">({{ ms }})</span></div>
  </div>
</template>
