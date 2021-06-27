
<template>
  <template v-for="item in list" :key="item.id">
    <div :ref="setRef">
      {{ item.value }}
    </div>
  </template>
</template>

<script lang="ts">
import { onMounted } from 'vue-demi'
import { useVForRefs } from '@vueuse/core'

export default {
  setup() {
    const list = [{ id: 0, value: 'foo' }, { id: 1, value: 'bar' }]
    const { refs, setRef } = useVForRefs()

    onMounted(() => {
      console.log(refs) // the <div> elements
    })

    return { list, setRef }
  },
}
</script>
