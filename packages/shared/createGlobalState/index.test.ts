import { computed, ref } from 'vue-demi'
import { useSetup } from '../../.test'
import { createGlobalState } from '.'

describe('createGlobalState', () => {
  it('should work after dispose 1', async () => {
    const useGlobalState = createGlobalState(() => {
      const counter = ref(1)
      const doubled = computed(() => counter.value * 2)

      return {
        counter,
        doubled,
      }
    })

    const { counter, doubled } = useGlobalState()

    const vm = useSetup(() => {
      const { counter, doubled } = useGlobalState()

      expect(counter.value).toBe(1)
      expect(doubled.value).toBe(2)

      return {
        counter,
        doubled,
      }
    })

    counter.value = 2

    expect(counter.value).toBe(2)
    expect(doubled.value).toBe(4)

    vm.unmount()

    counter.value = 3
    expect(counter.value).toBe(3)
    expect(doubled.value).toBe(6)
  })
})
