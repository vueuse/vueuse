<script setup lang="ts">
import { ref, toRefs } from 'vue-demi'
import { useInfiniteScroll } from '.'

const el = ref<HTMLElement | null>(null)
const data = ref([1, 2, 3, 4, 5, 6])

const loadMore = () => {
  data.value.push(...Array.from({ length: 5 }, () => Math.floor(Math.random() * 40)))
}
useInfiniteScroll(el, {
  infiniteScrollDistance: 10,
  loadMore,
})

</script>

<template>
  <div class="flex">
    <div ref="el" class="w-300px h-300px m-auto overflow-scroll bg-gray-500/5 rounded">
      <div v-for="item in data" :key="item" class="h-100px">
        {{ item }}
      </div>
    </div>
  </div>
</template>
