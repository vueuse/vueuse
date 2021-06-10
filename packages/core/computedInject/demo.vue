<script lang="ts">
import { defineComponent, InjectionKey, Ref, provide, ref } from 'vue-demi'
import { computedInject } from '.'

type OptionsRef = Ref<{ key: number; value: string }[]>

export default defineComponent({
  setup() {
    const ArrayKey: InjectionKey<OptionsRef> = Symbol('array')

    const array = ref([{ key: 1, value: '1' }, { key: 2, value: '2' }, { key: 3, value: '3' }])

    provide(ArrayKey, array)

    const computedArr = computedInject(ArrayKey, (source) => {
      if (!source) return ref([]) as OptionsRef
      const arr = [...source.value]
      arr.unshift({ key: 0, value: 'all' })
      return arr
    })

    return {
      array,
      computedArr,
    }
  },
})

</script>

<template>
  <div>
    <p>Array: {{ array }}</p>
    <p>ComputedArray: {{ computedArr }}</p>
  </div>
</template>
