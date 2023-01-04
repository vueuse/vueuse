import { ref } from 'vue-demi'
import { useArrayUnique } from '.'

describe('useArrayUnique', () => {
  it('should be defined', () => {
    expect(useArrayUnique).toBeDefined()
  })

  it('should work with array of refs', () => {
    const item1 = ref(0)
    const item2 = ref(1)
    const item3 = ref(1)
    const item4 = ref(2)
    const item5 = ref(3)
    const list = [item1, item2, item3, item4, item5]
    const result = useArrayUnique(list)
    expect(result.value.length).toBe(4)
    item5.value = 2
    expect(result.value.length).toBe(3)
  })

  it('should work with reactive array', () => {
    const list = ref([1, 2, 2, 3])
    const result = useArrayUnique(list)
    expect(result.value.length).toBe(3)
    list.value.push(1)
    expect(result.value.length).toBe(3)
  })

  it('is able to deduplicate objects based on a specific property', () => {
    const list = ref([
      {
        id: 1,
        value: 'foo',
      },
      {
        id: 2,
        value: 'bar',
      },
      {
        id: 3,
        value: 'foo',
      },
      {
        id: 1,
        value: 'bar',
      },
    ])
    let result = useArrayUnique(list, { property: 'id' })
    expect(result.value).toStrictEqual([
      {
        id: 1,
        value: 'foo',
      },
      {
        id: 2,
        value: 'bar',
      },
      {
        id: 3,
        value: 'foo',
      },
    ])

    // Try with property shortcut
    result = useArrayUnique(list, 'value')
    expect(result.value).toStrictEqual([
      {
        id: 1,
        value: 'foo',
      },
      {
        id: 2,
        value: 'bar',
      },
    ])
  })
})
