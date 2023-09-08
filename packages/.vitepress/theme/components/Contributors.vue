<script setup lang="ts">
// @ts-expect-error missing types
import _contributors from '/virtual-contributors'
import { computed } from 'vue'
import type { ContributorInfo } from '@vueuse/metadata'

const props = defineProps<{ fn: string }>()

const contributors = computed(() => _contributors[props.fn] || [] as ContributorInfo[])
</script>

<template>
  <div class="flex flex-wrap gap-4 pt-2">
    <div v-for="c of contributors" :key="c.hash" class="flex gap-2 items-center">
      <img :src="`https://gravatar.com/avatar/${c.hash}?d=retro`" class="w-8 h-8 rounded-full">
      {{ c.name }}
    </div>
  </div>
</template>
