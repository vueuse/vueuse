import { reactive, ref } from 'vue-demi'
import { useSetup } from '../../.test'
import { useArrayFind } from '../useArrayFind'

describe('useArrayFind', () => {
  it('should be defined', () => {
    expect(useArrayFind).toBeDefined()
  })

  it('should find positive', () => {
    useSetup(() => {
      const item1 = ref(1)
      const item2 = ref(2)
      const item3 = ref(3)
      const positive = useArrayFind([item1, item2, item3], val => val > 0)
      expect(positive.value).toBe(1)
      item1.value = -1
      expect(positive.value).toBe(2)
      item2.value = -1
      expect(positive.value).toBe(3)
      item3.value = -1
      expect(positive.value).toBe(undefined)
    })
  })

  it('should work with reactive array', () => {
    useSetup(() => {
      const list = reactive([-1, -2])
      const positive = useArrayFind(list, val => val > 0)
      expect(positive.value).toBe(undefined)
      list.push(1)
      expect(positive.value).toBe(1)
    })
  })
})
