import { describe, expect, it } from 'vitest'
import { shallowRef } from 'vue'
import { syncRefs } from './index'

describe('syncRefs', () => {
  it('should work with array', () => {
    const source = shallowRef('foo')
    const target1 = shallowRef('bar')
    const target2 = shallowRef('bar2')

    const stop = syncRefs(source, [target1, target2])

    expect(target1.value).toBe('foo')
    expect(target2.value).toBe('foo')

    source.value = 'bar'

    expect(target1.value).toBe('bar')
    expect(target2.value).toBe('bar')

    stop()

    source.value = 'bar2'

    expect(target1.value).toBe('bar')
    expect(target2.value).toBe('bar')
  })

  it('should work with non-array', () => {
    const source = shallowRef('foo')
    const target = shallowRef('bar')

    const stop = syncRefs(source, target)

    expect(target.value).toBe('foo')

    source.value = 'bar'

    expect(target.value).toBe('bar')

    stop()

    source.value = 'bar2'

    expect(target.value).toBe('bar')
  })
})
