<template>
  <div>ComputedArr: {{ computedArr }}</div>
</template>

<script lang="ts">
import { InjectionKey, Ref, defineComponent, ref } from 'vue-demi'
import { computedInject } from './index'

type OptionsRef = Ref<{ key: number; value: string }[]>

export const ArrayKey: InjectionKey<OptionsRef> = Symbol('array')

export default defineComponent({
  name: 'DemoProvider',
  setup() {
    const computedArr = computedInject(ArrayKey, (source) => {
      if (!source) return ref([]) as OptionsRef
      const arr = [...source.value]
      arr.unshift({ key: 0, value: 'all' })
      return arr
    })

    return {
      computedArr,
    }
  },
})
</script>

<style scoped>

</style>
