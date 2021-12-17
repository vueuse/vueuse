<script setup lang="ts">
defineProps<{ label: string }>()
</script>

<template>
  <div flex="~ col">
    <span font="medium mono">
      <slot />
    </span>
    <span font="medium" text="sm dark-50 opacity-80 dark:(light-900 opacity-50)">{{ label }}</span>
  </div>
</template>
