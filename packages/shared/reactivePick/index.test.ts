import { reactive } from 'vue-demi'
import { reactivePick } from '../reactivePick'

describe('reactivePick', () => {
  it('should be defined', () => {
    expect(reactivePick).toBeDefined()
  })

  it('should work', () => {
    const source = reactive({
      foo: 'foo',
      bar: 'bar',
    })
    const state = reactivePick(source, 'bar')

    expect(state).toEqual({
      bar: 'bar',
    })

    source.foo = 'foo2'

    expect(state).toEqual({
      bar: 'bar',
    })

    source.bar = 'bar1'

    expect(state).toEqual({
      bar: 'bar1',
    })
  })

  it('should write back', () => {
    const source = reactive({
      foo: 'foo',
      bar: 'bar',
    })
    const state = reactivePick(source, 'bar')

    state.bar = 'bar2'

    expect(source).toEqual({
      foo: 'foo',
      bar: 'bar2',
    })
  })
})
