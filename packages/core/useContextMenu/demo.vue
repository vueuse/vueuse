<script setup lang="ts">
import { useContextMenu } from '@vueuse/core'
import { useToggle } from '@vueuse/shared'
import { ref } from 'vue'
import Area from './area.vue'
const menuRef = ref<HTMLElement | null>(null)
const targetRef = ref<HTMLElement | null>(null)
const [hideOnClick, toggle] = useToggle(true)
const { visible, position } = useContextMenu(menuRef, {
  hideOnClick,
  target: targetRef,
})
</script>

<template>
  <div>
    <div ref="menuRef" class="menu">
      <div class="menu-item">
        copy
      </div>
      <div class="menu-item">
        paste
      </div>
      <div class="menu-item">
        cut
      </div>
    </div>
    <div flex gap-2>
      <Area ref="targetRef" />
      <div>
        <p>hideOnClick: <BooleanDisplay :value="hideOnClick" /></p>
        <p>visible: <BooleanDisplay :value="visible" /></p>
        <p>position: {{ position }}</p>
        <button @click="toggle()">
          toggle => hideOnClick
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.menu {
    @apply bg-$vp-c-bg overflow-hidden p-2 shadow-xl rounded-md b-1 b-color-gray-400/30;
    > div {
        @apply hover-bg-$vp-c-bg-mute hover-color-$vp-c-brand cursor-pointer px-2 rounded capitalize;
    }
}
</style>
