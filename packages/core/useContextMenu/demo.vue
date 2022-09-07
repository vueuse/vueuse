<script setup lang="ts">
import { useContextMenu } from '@vueuse/core'
import { useToggle } from '@vueuse/shared'
import { ref } from 'vue'
import Area from './area.vue'
import { UseContextMenu } from './component'

const menuRef = ref<HTMLElement | null>(null)
const targetRef = ref<HTMLElement | null>(null)
const [hideOnClick, toggle] = useToggle(true)

const {
  visible,
  position,
  enabled,
  stop,
} = useContextMenu(
  menuRef,
  { hideOnClick, target: targetRef },
)

const log = console.log
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
        <div>
          <span mr-2>hideOnClick: <BooleanDisplay :value="hideOnClick" /> </span>
          <button @click="toggle()">
            toggle
          </button>
        </div>
        <p>visible: <BooleanDisplay :value="visible" /></p>
        <p>enabled: <BooleanDisplay :value="enabled" /></p>
        <p>position: {{ position }}</p>
        <button :class="{ red: enabled }" @click="enabled = !enabled">
          {{ enabled ? 'disable' : 'enable' }}
        </button>
        <button @click="stop()">
          stop
        </button>
      </div>
    </div>
  </div>
  <div h="1px" bg="$vp-c-divider-light" m="block-4" />
  <UseContextMenu :hide-on-click="true">
    <!-- menu -->
    <template #menu="{ stop }">
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
        <div class="menu-item" @click="stop()">
          🚫 Stop Me
        </div>
      </div>
    </template>
    <!-- target -->
    <template #target="{ visible, stop, position }">
      <div flex gap-2>
        <Area>
          <p text-red>
            Renderless component
          </p>
          <p>
            Right click on me!
          </p>
        </Area>
        <div>
          <p>hideOnClick: <BooleanDisplay :value="true" /></p>
          <p>visible: <BooleanDisplay :value="visible" /></p>
          <p>position: {{ position }}</p>
          <button @click="stop()">
            stop
          </button>
        </div>
      </div>
    </template>
  </UseContextMenu>

  <!-- global menu -->
  <UseContextMenu
    v-slot="{ stop }"
    class="menu"
    z-20
    @context-menu="log('global menu clicked on:\n', $event.target)"
  >
    <div class="menu-item">
      ✅ Global 1
    </div>
    <div class="menu-item">
      ✅ Global 2
    </div>
    <div class="menu-item">
      ✅ Global 3
    </div>
    <div class="menu-item" @click="stop()">
      🚫 stop me
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
