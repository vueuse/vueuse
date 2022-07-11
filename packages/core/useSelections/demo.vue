<script setup lang="ts">
import { ref } from 'vue'
import { useSelections } from '@vueuse/core'

const list = ref([1, 2, 3, 4, 5, 6, 7, 8])
const { selected, allSelected, isSelected, toggle, toggleAll, partiallySelected } = useSelections(list.value, [1])
</script>

<template>
  <div>
    <div>Selected : {{ selected }}</div>
    <div style="borderbottom: 1px solid #eee; padding: 10px">
      <input type="checkbox" :checked="allSelected" @change="toggleAll" :indeterminate="partiallySelected" />
      check all
      <template v-for="item in list" :key="item">
        <input type="checkbox" :checked="isSelected(item)" @change="toggle(item)" />
        {{ item }}
      </template>
    </div>
  </div>
</template>
