import { reactive, ref } from 'vue-demi'
import { useTreeFind } from './index'

describe('useTreeFind', () => {
  it('should be defined', () => {
    expect(useTreeFind).toBeDefined()
  })

  it('should work', () => {
    const tree = ref([
      {
        id: '1',
        children: [
          {
            id: '1-1',
            children: [
              {
                id: '1-1-1',
              },
            ],
          },
        ],
      },
      {
        id: '2',
        children: [
          {
            id: '2-1',
            children: [
              {
                id: '2-1-1',
              },
            ],
          },
        ],
      },
    ])
    const result = useTreeFind(tree, item => item.id === '2-1-1')
    expect(result.value?.id).toBe('2-1-1')
    tree.value = []
    expect(result.value).toBeUndefined()
  })

  it('should work with childKey', () => {
    const tree = ref([
      {
        id: '1',
        child: [
          {
            id: '1-1',
            child: [
              {
                id: '1-1-1',
              },
            ],
          },
        ],
      },
      {
        id: '2',
        child: [
          {
            id: '2-1',
            child: [
              {
                id: '2-1-1',
              },
            ],
          },
        ],
      },
    ])
    const result = useTreeFind(tree, item => item.id === '2-1-1', { childKey: 'child' })
    expect(result.value?.id).toBe('2-1-1')
    tree.value = []
    expect(result.value).toBeUndefined()
  })

  it('should work with array of refs', () => {
    const item1 = ref({ id: '1', children: [{ id: '1-1' }] })
    const item2 = ref({ id: '2', children: [{ id: '2-1' }] })
    const item3 = ref({ id: '3', children: [{ id: '3-1' }] })
    const item4 = ref({ id: '4' })
    const item5 = ref({ id: '5' })
    const tree = ref([item1, item2, item3, item4, item5])
    const result = useTreeFind(tree, item => item.id === '3-1')
    expect(result.value?.id).toBe('3-1')
    item3.value = { id: '3', children: [{ id: '3-1-1' }] }
    expect(result.value).toBeUndefined()
  })
  it('should work with reactive array', () => {
    const tree = reactive([
      {
        id: '1',
        children: [
          {
            id: '1-1',
          },
        ],
      },
      {
        id: '2',
        children: [
          {
            id: '2-1',
            children: [
              {
                id: '2-1-1',
              },
            ],
          },
        ],
      },
    ])

    const result = useTreeFind(tree, item => item.id === '2-1-1')
    expect(result.value?.id).toBe('2-1-1')

    tree.pop()
    expect(result.value).toBeUndefined()

    tree.push({
      id: '2-1',
      children: [
        {
          id: '2-1-1',
        },
      ],
    })

    expect(result.value?.id).toBe('2-1-1')
  })
})
