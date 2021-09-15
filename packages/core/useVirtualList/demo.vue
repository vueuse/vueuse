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
    <div
      style="margin-bottom: 16px"
    >
      <input
        v-model="index"
        placeholder="line number"
        type="number"
        style="height: 34px;"
      />
      <button
        type="button"
        @click="handleScrollTo"
      >
        scroll to
      </button>
    </div>
    <div
      v-bind="containerProps"
      style="height: 300px; overflow: auto; box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);"
    >
      <div v-bind="wrapperProps">
        <div
          v-for="ele in list"
          :key="ele.index"
          :style="{
            height: ele.index % 2 === 0 ? '42px' : '84px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: '1px solid #e8e8e8',
            marginBottom: '8px',
          }"
        >
          Row: {{ ele.data }} size: {{ ele.index % 2 === 0 ? 'small' : 'large' }}
        </div>
      </div>
    </div>
  </div>
</template>
