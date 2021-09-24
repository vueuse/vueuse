<script setup lang="ts">
import { computed, ref, toRef } from 'vue'
import Fuse from 'fuse.js'
import { useUrlSearchParams } from '@vueuse/core'
import { functions, categories } from '../../../../meta/function-indexes'

// TODO: Sort by recent updated

const coreCategories = categories.filter(i => !i.startsWith('@'))
const addonCategories = categories.filter(i => i.startsWith('@'))

const query = useUrlSearchParams('hash-params', { removeFalsyValues: true })
const search = toRef(query, 'search')
const category = toRef(query, 'category')
const hasComponent = toRef(query, 'component')

const items = computed(() => {
  let fn = functions.filter(i => !i.internal)
  if (hasComponent.value)
    fn = fn.filter(i => i.component || i.directive)
  if (!category.value)
    return fn
  return fn.filter(item => item.category === category.value)
})
const fuse = computed(() => new Fuse(items.value, {
  keys: ['name', 'description'],
}))
const result = computed(() => {
  if (!search.value)
    return items.value
  return fuse.value.search(search.value).map(i => i.item)
})

function toggleCategory(cate: string) {
  category.value = category.value === cate ? null : cate
}
</script>

<template>
  <div class="grid grid-cols-[80px,auto] gap-y-2">
    <div opacity="80" text="sm">
      Core
    </div>
    <div flex="~ wrap" gap="2" m="b-2">
      <button
        v-for="cate of coreCategories"
        :key="cate"
        p="x-2 y-0.5"
        border="rounded"
        text="sm"
        :class="category === cate ? 'text-primary bg-primary/5' : 'bg-gray-400/5'"
        @click="toggleCategory(cate)"
      >
        {{ cate }}
      </button>
    </div>
    <div opacity="80" text="sm">
      Add-ons
    </div>
    <div flex="~ wrap" gap="2" m="b-2">
      <button
        v-for="cate of addonCategories"
        :key="cate"
        p="x-2 y-0.5"
        border="rounded"
        text="sm"
        :class="category === cate ? 'text-primary bg-primary/5' : 'bg-gray-400/5'"
        @click="toggleCategory(cate)"
      >
        {{ cate.slice(1) }}
      </button>
    </div>
    <div opacity="80" text="sm">
      Filters
    </div>
    <div flex="~">
      <label class="checkbox">
        <input v-model="hasComponent" type="checkbox" />
        <span>Has Component</span>
      </label>
    </div>
  </div>
  <div h="1px" bg="$vt-c-divider-light" m="t-4" />
  <div flex="~" class="children:my-auto" p="2">
    <carbon-search m="r-2" opacity="50" />
    <input v-model="search" type="text" role="search" placeholder="Search..." />
  </div>
  <div h="1px" bg="$vt-c-divider-light" m="b-4" />
  <div flex="~ col" gap="2">
    <FunctionBadge v-for="fn of result" :key="fn.name" :fn="fn" />
  </div>
  <div h="1px" bg="$vt-c-divider-light" m="t-4" />
</template>

<style scoped lang="postcss">
input {
  --tw-ring-offset-width: 1px !important;
  --tw-ring-color: #8885 !important;
  --tw-ring-offset-color: transparent !important;
}

.checkbox {
  @apply inline-flex items-center my-auto cursor-pointer select-none;

  input {
    @apply bg-gray-400/50;
    @apply rounded-md h-4 w-4;
  }

  span {
    @apply ml-2 text-13px opacity-70;
  }
}
</style>
