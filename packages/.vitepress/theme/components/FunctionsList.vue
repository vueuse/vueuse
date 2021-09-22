<script setup lang="ts">
import { computed, ref } from 'vue'
import Fuse from 'fuse.js'
import { functions, categories } from '../../../../meta/function-indexes'

// TODO: Filter by components/directives
// TODO: Sort by recent updated
// TODO: Categorized
// TODO: Reactive to hash

const search = ref('')
const enabledCategories = ref<string[]>([])

const items = computed(() => {
  if (enabledCategories.value.length === 0)
    return functions
  return functions.filter(item => item.category && enabledCategories.value.includes(item.category))
})
const fuse = computed(() => new Fuse(items.value, {
  keys: ['name', 'description'],
}))
const result = computed(() => {
  if (!search.value)
    return items.value
  return fuse.value.search(search.value).map(i => i.item)
})

function toggleCategory(category: string) {
  if (enabledCategories.value.includes(category))
    enabledCategories.value = enabledCategories.value.filter(c => c !== category)
  else
    enabledCategories.value = [category]
}
</script>

<template>
  <div flex="~ wrap" gap="2" m="b-2">
    <button
      v-for="cate of categories"
      :key="cate"
      p="x-2 y-0.5"
      border="rounded"
      text="sm"
      :class="enabledCategories.includes(cate) ? 'text-primary bg-primary/5' : 'bg-gray-400/5'"
      @click="toggleCategory(cate)"
    >
      {{ cate }}
    </button>
  </div>
  <div h="1px" bg="$vt-c-divider-light" m="t-4" />
  <div flex="~" class="children:my-auto" p="2">
    <carbon-search m="r-2" opacity="50" />
    <input
      v-model="search"
      type="text"
      role="search"
      placeholder="Search..."
    />
  </div>
  <div h="1px" bg="$vt-c-divider-light" m="b-4" />
  <div flex="~ col" gap="2">
    <FunctionBadge
      v-for="fn of result"
      :key="fn.name"
      :fn="fn"
    />
  </div>
  <div h="1px" bg="$vt-c-divider-light" m="t-4" />
</template>
