import { describe, expect, it } from 'vitest'
import { ref as deepRef, nextTick } from 'vue'
import { useFuse } from './index'

describe('useFuse', () => {
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
