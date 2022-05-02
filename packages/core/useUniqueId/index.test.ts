import { ref } from 'vue-demi'
import { useUniqueId } from '.'

describe('useUniqueId', () => {
  test('shoule be defined', () => {
    expect(useUniqueId).toBeDefined()
  })

  test('shoule be unique', () => {
    const prefix = ref('prefix_')
    const prefix2 = ref('prefix2_')

    const id1 = useUniqueId()
    const id2 = useUniqueId()
    const id3 = useUniqueId('prefix_')
    const id4 = useUniqueId('prefix_')
    const id5 = useUniqueId('prefix2_')
    const id6 = useUniqueId(prefix)
    const id7 = useUniqueId(prefix2)

    expect(id1.value).not.toBe(id2.value)
    expect(id3.value).not.toBe(id4.value)
    expect(id5.value).not.toBe(id7.value)
    expect(id6.value).not.toBe(id3.value)

    expect(id1.value).toBe('$$unique_1')
    expect(id2.value).toBe('$$unique_2')
    expect(id3.value).toBe('prefix_1')
    expect(id4.value).toBe('prefix_2')
    expect(id5.value).toBe('prefix2_1')
    expect(id6.value).toBe('prefix_3')
    expect(id7.value).toBe('prefix2_2')
  })
})
