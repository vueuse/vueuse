import { ref } from 'vue-demi'
import { useSetup } from '../../.test'
import { useDebouncedRefHistory } from '.'

describe('useDebouncedRefHistory - ', () => {
  test('take snapshot of data after given time after data was changed', () => {
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

  test('undefined debounce don`t break function', () => {
    useSetup(() => {
      const v = ref(0)

      const { history } = useDebouncedRefHistory(v, { deep: false })
      v.value = 100
      expect(history.value.length).toBe(2)
      expect(history.value[0].snapshot).toBe(100)
    })
  })
})
