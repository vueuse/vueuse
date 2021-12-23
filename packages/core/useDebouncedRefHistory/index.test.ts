import { ref } from 'vue-demi'
import { useSetup } from '../../.test'
import { useDebouncedRefHistory } from '.'

describe('useDebouncedRefHistory', () => {
  test('Once the ref\'s value has changed and some time has passed, ensure the snapshot is updated', () => {
    useSetup(() => {
      const ms = 1000
      const v = ref(0)

      const { history } = useDebouncedRefHistory(v, { debounce: ms })
      v.value = 100
      expect(history.value.length).toBe(1)
      expect(history.value[0].snapshot).toBe(0)

      setTimeout(() => {
        expect(history.value.length).toBe(2)
        expect(history.value[0].snapshot).toBe(100)
      }, ms)
    })
  })

  test('when debounce is undefined', () => {
    useSetup(() => {
      const v = ref(0)

      const { history } = useDebouncedRefHistory(v, { deep: false })
      v.value = 100
      expect(history.value.length).toBe(2)
      expect(history.value[0].snapshot).toBe(100)
    })
  })
})
