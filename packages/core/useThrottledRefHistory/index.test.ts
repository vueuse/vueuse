import { ref } from 'vue-demi'
import { useSetup } from '../../.test'
import { useThrottledRefHistory } from '.'

describe('useThrottledRefHistory - sync', () => {
  test('take first snapshot right after data was changed and second after given time', () => {
    useSetup(() => {
      const ms = 1000
      const v = ref(0)

      const { history } = useThrottledRefHistory(v, { throttle: ms })
      v.value = 100

      expect(history.value.length).toBe(2)
      expect(history.value[0].snapshot).toBe(100)

      v.value = 200
      v.value = 300
      v.value = 400

      setTimeout(() => {
        expect(history.value.length).toBe(3)
        expect(history.value[0].snapshot).toBe(400)
      }, ms)
    })
  })
})
