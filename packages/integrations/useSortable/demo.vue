<script setup lang="ts">
import { ref as deepRef, useTemplateRef } from 'vue'
import { useSortable } from './index'

const el = useTemplateRef<HTMLElement>('el')
const list = deepRef([{ id: 1, name: 'a' }, { id: 2, name: 'b' }, { id: 3, name: 'c' }])

const { option } = useSortable(el, list, {
  animation: 150,
})
</script>

<template>
  <button @click="option('animation', 150)">
    on animation
  </button>
  <button @click="option('animation', 0)">
    off animation
  </button>
  <div ref="el" class="flex flex-col gap-2 p-4 w-300px h-200px m-auto bg-gray-500/5 rounded">
    <div v-for="item in list" :key="item.id" class="h20 bg-gray-500/5 rounded p-3">
      {{ item.name }}
    </div>
  </div>
  <div class="text-center">
    {{ JSON.stringify(list) }}
  </div>
</template>
