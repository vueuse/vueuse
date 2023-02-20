import { promiseTimeout } from '@vueuse/shared'
import { ref } from 'vue-demi'
import { useSearch } from '.'

describe('useSearch', () => {
  const searchList = ref([
    {
      name: 'Jane1',
      age: 20,
    },
    {
      name: 'Jane2',
      age: 22,
    },
    {
      name: 'Yang1',
      age: 30,
    },
    {
      name: 'Yang2',
      age: 40,
    },
  ])

  beforeEach(() => {
    searchList.value = [
      {
        name: 'Jane1',
        age: 20,
      },
      {
        name: 'Jane2',
        age: 22,
      },
      {
        name: 'Yang1',
        age: 30,
      },
      {
        name: 'Yang2',
        age: 40,
      },
    ]
  })
  it('should be defined', () => {
    expect(useSearch).toBeDefined()
  })

  it('should search string array', () => {
    const list = ref(['Jane1', 'Jane2', 'Yang1', 'Yang2'])
    const keyword = ref('')

    const { data, search } = useSearch(list, keyword)
    expect(data.value).toEqual(['Jane1', 'Jane2', 'Yang1', 'Yang2'])

    keyword.value = 'Jane'
    expect(data.value).toEqual(['Jane1', 'Jane2'])

    search('Yang')
    expect(data.value).toEqual(['Yang1', 'Yang2'])
  })

  it('should search object array', () => {
    const keyword = ref('')
    const { data, search } = useSearch(searchList, keyword, { field: 'name' })
    expect(data.value).toEqual([
      {
        name: 'Jane1',
        age: 20,
      },
      {
        name: 'Jane2',
        age: 22,
      },
      {
        name: 'Yang1',
        age: 30,
      },
      {
        name: 'Yang2',
        age: 40,
      },
    ])

    keyword.value = 'Jane'
    expect(data.value).toEqual([
      {
        name: 'Jane1',
        age: 20,
      },
      {
        name: 'Jane2',
        age: 22,
      },
    ])

    search('Yang')
    expect(data.value).toEqual([
      {
        name: 'Yang1',
        age: 30,
      },
      {
        name: 'Yang2',
        age: 40,
      },
    ])
  })

  it('should search object array with immediate', () => {
    const keyword = ref('Jane')
    const { data, search } = useSearch(searchList, keyword, { field: 'name' })
    expect(data.value).toEqual([
      {
        name: 'Jane1',
        age: 20,
      },
      {
        name: 'Jane2',
        age: 22,
      },
    ])
    search('Yang')
    expect(data.value).toEqual([{
      name: 'Yang1',
      age: 30,
    },
    {
      name: 'Yang2',
      age: 40,
    }])
  })

  it('should search object array with custom filter', () => {
    const keyword = ref('yang')
    const { data } = useSearch(searchList, keyword, {
      filter: (item, keyword) => item.age <= 20 || item.name.toLowerCase().includes(keyword),
    })
    expect(data.value).toEqual([
      {
        name: 'Jane1',
        age: 20,
      },
      {
        name: 'Yang1',
        age: 30,
      },
      {
        name: 'Yang2',
        age: 40,
      },
    ])
  })

  it('should search string array with delay', async () => {
    const list = ref(['Jane1', 'Jane2', 'Yang1', 'Yang2'])
    const keyword = ref('')

    const { data } = useSearch(list, keyword, { delay: 60 })
    expect(data.value).toEqual(['Jane1', 'Jane2', 'Yang1', 'Yang2'])

    keyword.value = 'Ja'
    keyword.value = 'Jane'
    await promiseTimeout(40)
    expect(data.value).toEqual(['Jane1', 'Jane2', 'Yang1', 'Yang2'])

    await promiseTimeout(70)
    expect(data.value).toEqual(['Jane1', 'Jane2'])
  })
})
