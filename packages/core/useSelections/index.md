---
category: Elements
---

# useSelections

This hook is used for Checkbox group, supports multiple selection, single selection, select-all, select-none and semi-selected etc.

## Usage

``` html
<script setup lang="ts">
import { ref } from 'vue'
import { useSelections } from '@/hooks/useSelections'

const list = ref([1, 2, 3, 4, 5, 6, 7, 8])

const { selected, allSelected, isSelected, toggle, toggleAll, partiallySelected } = useSelections(list.value, [1])
  
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

</script>
```