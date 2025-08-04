<script setup lang="ts">
import { useCycleList } from '@vueuse/core'
import { shallowRef } from 'vue'

const list = shallowRef([
  'Dog',
  'Cat',
  'Lizard',
  'Shark',
  'Whale',
  'Dolphin',
  'Octopus',
  'Seal',
])

const { state, index, next, prev, go } = useCycleList(list)
</script>

<template>
  <div flex="~ col" items="center" gap="6">
    <div class="relative w-80 h-80">
      <div
        v-for="(item, i) in list"
        :key="item"
        flex="~ items-center justify-center"
        w="16"
        h="16"
        rounded="full"
        border="2"
        text="sm"
        font="semibold"
        cursor="pointer"
        transition="all duration-300 transform hover:scale-110"
        class="absolute"
        :class="[
          index === i
            ? 'bg-primary text-white border-primary shadow-lg scale-110'
            : 'bg-gray-200 text-gray-600 border-gray-300 hover:bg-gray-300',
        ]"
        :style="{
          top: `${50 + 40 * Math.sin((i / list.length) * 2 * Math.PI - Math.PI / 2)}%`,
          left: `${50 + 40 * Math.cos((i / list.length) * 2 * Math.PI - Math.PI / 2)}%`,
          transform: 'translate(-50%, -50%)',
        }"
        @click="go(i)"
      >
        {{ item }}
      </div>

      <div
        flex="~ items-center justify-center col"
        gap="2"
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <div text="2xl font-bold text-primary">
          {{ state }}
        </div>
        <div text="sm opacity-50">
          {{ index + 1 }} / {{ list.length }}
        </div>
      </div>
    </div>

    <div flex="~ gap-4">
      <button class="button" @click="prev()">
        ← Prev
      </button>
      <button class="button" @click="next()">
        Next →
      </button>
    </div>
  </div>
</template>
