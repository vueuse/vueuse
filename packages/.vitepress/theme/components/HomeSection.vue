<script setup lang="ts">
defineProps<{
  title: string
  description: string
}>()
</script>

<template>
  <h2 font-normal pt-5 pb-2 px4 flex="~ gap-4 items-center" w-full>
    <div border="t main solid" h-1px w-full />
    <span ws-nowrap>{{ title }}</span>
    <div border="t main solid" h-1px w-full />
  </h2>
  <div op50 text-center max-w-130 mxa>
    {{ description }}
  </div>
</template>
