import { ref } from 'vue-demi'
import { useSetup } from '../../.test'
import { useDebouncedRefHistory } from '.'

describe('useDebouncedRefHistory - sync', () => {
  test('take snapshot of data after given time after data was changed', () => {
    useSetup(() => {
      const ms = 1000
      const v = ref(0)

      const { history } = useDebouncedRefHistory(v, { flush: 'sync' }, ms)
      v.value = 100
      expect(history.value.length).toBe(1)
      expect(history.value[0].snapshot).toBe(0)

      setTimeout(() => {
        expect(history.value.length).toBe(2)
        expect(history.value[0].snapshot).toBe(100)
      }, ms)
    })
  })
})
