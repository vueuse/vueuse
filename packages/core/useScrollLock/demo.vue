<script setup lang="ts">
import { ref } from 'vue'
import { useToggle } from '@vueuse/shared'
import { useScroll, useScrollLock } from '@vueuse/core'

const el = ref<HTMLElement | null>(null)
useScroll(el)
const isLocked = useScrollLock(el)
const toggleLock = useToggle(isLocked)
</script>

<template>
  <div class="flex flex-wrap gap-4">
    <div ref="el" class="w-300px h-300px m-auto overflow-scroll bg-gray-500/5 rounded">
      <div class="w-500px h-400px relative">
        <div position="absolute left-0 top-0" bg="gray-500/5" p="x-2 y-1">
          TopLeft
        </div>
        <div position="absolute left-0 bottom-0" bg="gray-500/5" p="x-2 y-1">
          BottomLeft
        </div>
        <div position="absolute right-0 top-0" bg="gray-500/5" p="x-2 y-1">
          TopRight
        </div>
        <div position="absolute right-0 bottom-0" bg="gray-500/5" p="x-2 y-1">
          BottomRight
        </div>
        <div position="absolute left-1/3 top-1/3" bg="gray-500/5" p="x-2 y-1">
          Scroll Me
        </div>
      </div>
    </div>
    <div class="m-auto px-6 py-4 rounded flex flex-col w-60 gap-2 bg-gray-500/5">
      <div>
        <span opacity="75">
          isLocked
        </span>
        <BooleanDisplay :value="isLocked" />
      </div>
      <button opacity="75" @click="toggleLock()">
        {{ isLocked ? 'Unlock' : 'Lock' }}
      </button>
    </div>
  </div>
</template>
