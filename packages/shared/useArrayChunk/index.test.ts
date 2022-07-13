import { ref } from 'vue-demi'
import type { MaybeRef } from '@vueuse/shared'
import { useArrayChunk } from '.'

describe('useArrayChunk', () => {
  it('should be defined', () => {
    expect(useArrayChunk).toBeDefined()
  })

  it('should accept reactivity array', () => {
    const array = ref<MaybeRef<number>[]>([1, 2, 3, 4])
    const size = ref(2)
    const result = useArrayChunk(array, size)
    expect(result.value).toEqual([[1, 2], [3, 4]])

    array.value = [-1, ref(-2), -3, -4]
    size.value = 3
    expect(result.value).toEqual([[-1, -2, -3], [-4]])
  })

  it('should accept reactivity array item', () => {
    const v1 = ref(1)
    const v2 = ref(2)
    const v3 = ref(3)
    const v4 = ref(4)
    const size = ref(2)
    const result = useArrayChunk([v1, v2, () => v3.value, v4], size)
    expect(result.value).toEqual([[1, 2], [3, 4]])

    v1.value = -1
    v3.value = -3
    size.value = 3
    expect(result.value).toEqual([[-1, 2, -3], [4]])
  })
})
