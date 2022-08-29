<script setup lang="ts">
import { useContextMenu } from '@vueuse/core'
import { useToggle } from '@vueuse/shared'
import { ref } from 'vue'
import Area from './area.vue'
import { UseContextMenu } from './component'
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
      <Area ref="targetRef">
        Right click on me!
      </Area>
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

  <UseContextMenu>
    <!-- menu -->
    <template #menu>
      <div class="menu">
        <div class="menu-item">
          🚀 menu 1
        </div>
        <div class="menu-item">
          🎁 menu 2
        </div>
        <div class="menu-item">
          💖 menu 3
        </div>
      </div>
    </template>
    <!-- target -->
    <template #target="{ visible }">
      <Area wa>
        <p text-red>
          This is a Renderless component
        </p>
        <p>
          Right click on me as well!
        </p>
        <p>visible: <BooleanDisplay :value="visible" /></p>
      </Area>
    </template>
  </UseContextMenu>

  <!-- global menu -->
  <UseContextMenu class="menu" z-20>
    <div class="menu-item">
      ✅Global 1
    </div>
    <div class="menu-item">
      ✅Global 2
    </div>
    <div class="menu-item">
      ✅Global 3
    </div>
  </UseContextMenu>
</template>

<style lang="postcss" scoped>
.menu {
    @apply bg-$vp-c-bg overflow-hidden p-2 shadow-xl rounded-md b-1 b-color-gray-400/30;
    &-item {
        @apply hover-bg-$vp-c-bg-mute hover-color-$vp-c-brand cursor-pointer px-2 rounded capitalize;
    }
}
</style>
