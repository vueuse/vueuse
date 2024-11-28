<script setup lang="ts">
import { useElementVisibility } from '@vueuse/core'
import { ref } from 'vue'

const target = ref(null)
const targetIsVisible = useElementVisibility(target)
</script>

<template>
  <div ref="target" class="demo-card scale-60 ">
    <template v-if="targetIsVisible">
      <slot />
    </template>
  </div>
</template>

<style lang="css" scoped>
.demo-card {
  width: 100%;
  font-size: var(--vt-doc-code-font-size);
  background: var(--vp-code-block-bg);
  position: relative;
  margin-bottom: 10px;
  border-radius: 8px;
  transition: background-color 0.5s;
}
</style>
