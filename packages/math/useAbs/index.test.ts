import { ref } from 'vue-demi'
import { useAbs } from '.'

describe('useAbs', () => {
  test('should be defined', () => {
    expect(useAbs).toBeDefined()
  })

  test('this should work', () => {
    const original = ref(-1)
    const abs = useAbs(original)

    expect(abs.value).toBe(1)

    original.value = -23
    expect(abs.value).toBe(23)

    original.value = 10
    expect(abs.value).toBe(10)

    original.value = 0
    expect(abs.value).toBe(0)
  })

  test('getter', () => {
    const original = ref(-1)
    const abs = useAbs(() => original.value)

    expect(abs.value).toBe(1)

    original.value = -23
    expect(abs.value).toBe(23)

    original.value = 10
    expect(abs.value).toBe(10)

    original.value = 0
    expect(abs.value).toBe(0)
  })
})
