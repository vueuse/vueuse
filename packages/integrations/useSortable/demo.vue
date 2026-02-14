<script setup lang="ts">
import { useSortable } from '@vueuse/integrations/useSortable'
import { shallowRef, useTemplateRef } from 'vue'

const el = useTemplateRef('el')
const list = shallowRef([{ id: 1, name: 'a' }, { id: 2, name: 'b' }, { id: 3, name: 'c' }])

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
