import { ref } from 'vue-demi'
import { useCycleList } from '.'

describe('useCycleList', () => {
  it('should work with array', () => {
    const { state, next, prev, index } = useCycleList(['foo', 'bar', 'fooBar'])

    expect(state.value).toBe('foo')
    expect(index.value).toBe(0)

    next()

    expect(state.value).toBe('bar')
    expect(index.value).toBe(1)

    prev()

    expect(state.value).toBe('foo')
    expect(index.value).toBe(0)

    index.value = 2

    expect(state.value).toBe('fooBar')
    expect(index.value).toBe(2)

    state.value = 'foo'

    expect(state.value).toBe('foo')
    expect(index.value).toBe(0)
  })

  it('should work with ref', () => {
    const list = ref(['foo', 'bar', 'fooBar'])

    const { state, next, prev, index } = useCycleList(list)

    expect(state.value).toBe('foo')
    expect(index.value).toBe(0)

    next()

    expect(state.value).toBe('bar')
    expect(index.value).toBe(1)

    prev()

    expect(state.value).toBe('foo')
    expect(index.value).toBe(0)

    index.value = 2

    expect(state.value).toBe('fooBar')
    expect(index.value).toBe(2)

    state.value = 'foo'

    expect(state.value).toBe('foo')
    expect(index.value).toBe(0)
  })

  describe('when list empty', () => {
    it('returns the correctly data', () => {
      const list = ref(['foo', 'bar', 'fooBar'])

      const { state, index } = useCycleList(list)

      list.value = []
      index.value = 2

      expect(state.value).toBeUndefined()
      expect(index.value).toBe(0)
    })
  })
})
