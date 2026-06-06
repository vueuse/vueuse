import { describe, expect, it } from 'vitest'
import { ref as deepRef, nextTick } from 'vue'
import { useFuse } from './index'

describe('useFuse', () => {
  it('should be defined', () => {
    expect(useFuse).toBeDefined()
  })

  it('returns results for a static collection', () => {
    const data = ['apple', 'banana', 'cherry']
    const { results } = useFuse('apple', data)
    expect(results.value.length).toBeGreaterThan(0)
    expect(results.value[0].item).toBe('apple')
  })

  it('reacts to reactive query changes', async () => {
    const query = deepRef('apple')
    const data = ['apple', 'banana', 'cherry']
    const { results } = useFuse(query, data)
    expect(results.value[0].item).toBe('apple')
    query.value = 'banana'
    await nextTick()
    expect(results.value[0].item).toBe('banana')
  })

  it('reacts to reactive collection changes', async () => {
    const query = deepRef('mango')
    const data = deepRef(['apple', 'banana', 'cherry'])
    const { results } = useFuse(query, data, {
      fuseOptions: { threshold: 0.3 },
    })

    // Initially 'mango' is not in the collection
    expect(results.value.length).toBe(0)

    // Add 'mango' to the collection
    data.value = [...data.value, 'mango']
    await nextTick()

    // Results should now include 'mango'
    expect(results.value.length).toBeGreaterThan(0)
    expect(results.value[0].item).toBe('mango')
  })

  it('matchAllWhenSearchEmpty returns all items', () => {
    const data = ['apple', 'banana', 'cherry']
    const { results } = useFuse('', data, { matchAllWhenSearchEmpty: true })
    expect(results.value.length).toBe(3)
  })

  it('matchAllWhenSearchEmpty reacts to reactive collection changes', async () => {
    const query = deepRef('')
    const data = deepRef(['apple', 'banana', 'cherry'])
    const { results } = useFuse(query, data, { matchAllWhenSearchEmpty: true })

    expect(results.value.length).toBe(3)

    data.value = [...data.value, 'mango']
    await nextTick()

    expect(results.value.length).toBe(4)
    expect(results.value.map(r => r.item)).toContain('mango')
  })

  it('respects resultLimit option', () => {
    const data = ['apple', 'apricot', 'avocado']
    const { results } = useFuse('a', data, { resultLimit: 2 })
    expect(results.value.length).toBeLessThanOrEqual(2)
  })
})
