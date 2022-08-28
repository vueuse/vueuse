<script setup lang="ts">
import { useContextMenu } from '@vueuse/core'
import { ref } from 'vue'
import Area from './area.vue'
const menuRef = ref<HTMLElement | null>(null)
const targetRef = ref<HTMLElement | null>(null)
const hideOnClick = ref(false)
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
        <button @click="hideOnClick = !hideOnClick">
          toggle => hideOnClick
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.menu {
    @apply bg-white b-rd-2 shadow-xl b b-[#ddd] overflow-hidden p-2;
    > div {
        @apply hover-bg-[#eee] hover-color-[var(--vp-c-brand)] cursor-pointer px-2 b-rd-1 capitalize;
    }
}
</style>
