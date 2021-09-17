<script setup lang="ts">
import { ref, Ref } from 'vue-demi'
import { useVirtualList } from '.'

const index: Ref = ref(0)
const { list, containerProps, wrapperProps, scrollTo } = useVirtualList(
  Array.from(Array(99999).keys()),
  {
    itemHeight: i => (i % 2 === 0 ? 42 + 8 : 84 + 8),
    overscan: 10,
  },
)
const handleScrollTo = () => {
  scrollTo(index.value)
}
</script>

<template>
  <div>
    <div class="mb-4 flex gap-2">
      <input v-model="index" placeholder="Index" type="number" />
      <button type="button" @click="handleScrollTo">
        Go
      </button>
    </div>
    <div v-bind="containerProps" class="h-300px overflow-auto p-2 bg-gray-500/5 rounded">
      <div v-bind="wrapperProps">
        <div
          v-for="ele in list"
          :key="ele.index"
          class="border border-$c-divider mb-2"
          :style="{
            height: ele.index % 2 === 0 ? '42px' : '84px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }"
        >
          Row {{ ele.data }}
          <span opacity="70" m="l-1">({{ ele.index % 2 === 0 ? 'small' : 'large' }})</span>
        </div>
      </div>
    </div>
  </div>
</template>
