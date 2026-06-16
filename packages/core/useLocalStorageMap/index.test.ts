import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { useLocalStorageMap } from '.'

describe('useLocalStorageMap', () => {
  it('basic usage', () => {
    const newMap = useLocalStorageMap('test-map', new Map([['key1', 'value1'], ['key2', 'value2']]))
    expect(newMap.value.get('key1')).toBe('value1')

    newMap.value.set('key3', 'value3')
    expect(newMap.value.get('key3')).toBe('value3')

    newMap.value.delete('key1')
    nextTick(() => {
      expect(localStorage.getItem('test-map')).toMatch(/\{"key2":"value2","key3":"value3"\}/)
    })
  })

  it('should remove the map from localStorage', () => {
    const newMap = useLocalStorageMap('test-map-remove', new Map([['key1', 'value1']]))
    expect(localStorage.getItem('test-map-remove')).toBeDefined()

    newMap.value.clear()
    nextTick(() => {
      expect(localStorage.getItem('test-map-remove')).toBeNull()
    })
  })

  it('should handle initial empty map', () => {
    const newMap = useLocalStorageMap('test-map-empty', new Map())
    expect(newMap.value.size).toBe(0)

    newMap.value.set('key1', 'value1')
    expect(newMap.value.get('key1')).toBe('value1')
  })

  it('should handle non-string keys', () => {
    const newMap = useLocalStorageMap('test-map-non-string', new Map([[1, 'value1'], [2, 'value2']]))
    expect(newMap.value.get(1)).toBe('value1')

    newMap.value.set(3, 'value3')
    expect(newMap.value.get(3)).toBe('value3')

    newMap.value.delete(1)
    nextTick(() => {
      expect(localStorage.getItem('test-map-non-string')).toMatch(/\{"2":"value2","3":"value3"\}/)
    })
  })

  it('should handle complex objects as values', () => {
    const newMap = useLocalStorageMap<string, { a?: number, b?: number }>('test-map-complex', new Map())
    expect(newMap.value.size).toBe(0)

    newMap.value.set('key1', { a: 1 })
    expect(newMap.value.get('key1')).toEqual({ a: 1 })

    newMap.value.set('key2', { b: 2 })
    expect(newMap.value.get('key2')).toEqual({ b: 2 })

    newMap.value.delete('key1')
    nextTick(() => {
      expect(localStorage.getItem('test-map-complex')).toMatch(/\{"key2":\{"b":2\}\}/)
    })
  })

  it('should handle options', () => {
    const newMap = useLocalStorageMap('test-map-options', new Map(), {
      listenToStorageChanges: true,
    })
    expect(newMap.value.size).toBe(0)

    newMap.value.set('key1', 'value1')
    expect(newMap.value.get('key1')).toBe('value1')

    localStorage.setItem('test-map-options', JSON.stringify([['key2', 'value2']]))
    nextTick(() => {
      expect(newMap.value.get('key2')).toBe('value2')
    })
  })
})
