<script lang="ts">
import { useStorage } from '@vueuse/core'
import { watchEffect } from 'vue'

const preferJS = useStorage('vueuse-prefer-js', false)

watchEffect(() => {
  if (typeof window !== 'undefined')
    document.body.classList.toggle('vueuse-prefer-js', preferJS.value)
})
</script>

<script setup lang="ts">
const js = preferJS
</script>

<template>
  <div flex="~ justify-end" mb--2 mt--4>
    <label class="flex text-xs items-center px3 gap-1 bg-$vp-code-block-bg rounded-full py1" relative>
      <input
        v-model="preferJS"
        absolute inset-0 opacity-0 w-full h-full
        type="checkbox"
      >
      <span font-mono :class="js ? 'text-amber' : 'text-blue'" op75>{{ js ? 'JavaScript' : 'TypeScript' }}</span>
    </label>
  </div>

  <slot />
</template>

<style>
body.vueuse-prefer-js .code-block-ts {
  display: none;
}

body:not(.vueuse-prefer-js) .code-block-js {
  display: none;
}

.code-toggle-switch {
  position: relative;
  border-radius: 11px;
  display: block;
  flex-shrink: 0;
  border: 1px solid var(--vp-input-border-color);
  background-color: var(--vp-input-switch-bg-color);
  transition: border-color 0.25s;
}
</style>
