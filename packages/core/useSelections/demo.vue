<script setup lang="ts">
import { useSelections } from '.'
const data = [1, 2, 3, 4, 5]
const { selected, noneSelected, allSelected, partiallySelected, isSelected, toggle, select, unSelect } = useSelections(data, [1, 2, 3])

</script>

<template>
  <div class="flex">
    <fieldset class="max-w-max border-2 rounded-lg border-gray-400/30 space-y-1 mr-10">
      <legend class="px-1">
        Checkbox
      </legend>
      <div v-for="(item,index) in data" :key="index">
        <input
          id="checkbox-exact-match"
          :checked="isSelected(item)"
          type="checkbox"
          @click.self="toggle(item)"
        >
        <label for="checkbox-exact-match">{{ item }} {{ isSelected(item) }}</label>
      </div>
    </fieldset>
    <div class="w-300px mt-10px px-6 py-4 rounded grid grid-cols-[120px,auto] gap-2 bg-gray-500/5">
      <div text="right" opacity="75">
        selected
      </div>
      <div>{{ JSON.stringify(selected) }}</div>
      <div text="right" opacity="75">
        noneSelected
      </div>
      <BooleanDisplay :value="noneSelected" />
      <div text="right" opacity="75">
        allSelected
      </div>
      <BooleanDisplay :value="allSelected" />
      <div text="right" opacity="75">
        partiallySelected
      </div>
      <BooleanDisplay :value="partiallySelected" />
    </div>
  </div>
  <button opacity="75" @click="select()">
    Select All
  </button>
  <button opacity="75" @click="unSelect()">
    UnSelect All
  </button>
</template>
