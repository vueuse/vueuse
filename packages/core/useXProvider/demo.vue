<script setup lang="ts">
import { computed, defineComponent, h } from 'vue-demi'
import { useXProvider } from '.'
interface IContext {
  name: string
  age: number
  action: Function
}
const defaultState = {
  name: 'hello',
  age: 20,
}

const { ProviderComponent, setState, useContext } = useXProvider<IContext>(defaultState)
const DescendNode = defineComponent({
  setup() {
    const demoContext = useContext()
    const name = computed(() => demoContext.name)
    return {
      name,
    }
  },
  render() {
    return h('div', {})
  },
})
</script>

<template>
  <ProviderComponent>
    <DescendNode></DescendNode>
  </ProviderComponent>
</template>
