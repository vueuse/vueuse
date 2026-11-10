import type { Expression } from 'fuse.js'
import { describe, expect, it } from 'vitest'
import { ref as deepRef, nextTick, shallowRef } from 'vue'
import { useFuse } from './index'

describe('useFuse', () => {
  const books = [
    { title: 'Old War', author: 'Alice' },
    { title: 'Old War', author: 'Bob' },
    { title: 'New World', author: 'Alice' },
  ]
  const fuseOptions = { keys: ['title', 'author'], useExtendedSearch: true }

  it('supports nested logical queries', () => {
    const { results } = useFuse({
      $and: [
        { author: '=Alice' },
        { $or: [{ title: '="Old War"' }, { title: '="New World"' }] },
      ],
    }, books, { fuseOptions })

    expect(results.value.map(result => result.item)).toEqual([books[0], books[2]])
  })

  it('reacts to switching between string and logical queries', () => {
    const search = shallowRef<string | Expression>('="Old War"')
    const { results } = useFuse(search, books, {
      fuseOptions,
      matchAllWhenSearchEmpty: true,
    })

    expect(results.value.map(result => result.item)).toEqual([books[0], books[1]])

    search.value = { $and: [{ author: '=Alice' }, { title: '="New World"' }] }
    expect(results.value.map(result => result.item)).toEqual([books[2]])

    search.value = ''
    expect(results.value.map(result => result.item)).toEqual(books)
  })

  it('accepts a logical query getter and respects the result limit', () => {
    const author = shallowRef('Alice')
    const { results } = useFuse(
      () => ({ author: `=${author.value}` }),
      books,
      { fuseOptions, resultLimit: 1 },
    )

    expect(results.value.map(result => result.item)).toEqual([books[0]])

    author.value = 'Bob'
    expect(results.value.map(result => result.item)).toEqual([books[1]])
  })

  it('updates results when data changes', async () => {
    const search = deepRef('')
    const data = deepRef([{ name: 'foo' }])
    const { results } = useFuse(search, data, { matchAllWhenSearchEmpty: true })

    expect(results.value).toHaveLength(1)
    expect(results.value[0].item.name).toBe('foo')

    data.value = [{ name: 'bar' }, { name: 'baz' }]
    await nextTick()

    expect(results.value).toHaveLength(2)
    expect(results.value[0].item.name).toBe('bar')
    expect(results.value[1].item.name).toBe('baz')
  })

  it('searches updated data', async () => {
    const search = deepRef('bar')
    const data = deepRef([{ name: 'foo' }])
    const { results } = useFuse(search, data, { fuseOptions: { keys: ['name'] } })

    expect(results.value).toHaveLength(0)

    data.value = [{ name: 'bar' }]
    await nextTick()

    expect(results.value).toHaveLength(1)
    expect(results.value[0].item.name).toBe('bar')
  })
})
