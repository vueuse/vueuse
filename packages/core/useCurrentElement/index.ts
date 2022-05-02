// eslint-disable-next-line no-restricted-imports
import { computed, getCurrentInstance, onMounted, onUpdated, ref } from 'vue-demi'

export function useCurrentElement<T extends Element = Element>() {
  const vm = getCurrentInstance()!
  const count = ref(0)
  onUpdated(() => {
    count.value += 1
  })
  onMounted(() => {
    count.value += 1
  })
  return computed<T>(() => {
    // force update
    // eslint-disable-next-line no-unused-expressions
    count.value
    return vm.proxy!.$el
  })
}
