import { ref } from 'vue-demi'
import { syncRefs } from '.'

describe('syncRefs', () => {
  it('should work', () => {
    const source = ref('foo')
    const target1 = ref('bar')
    const target2 = ref('bar2')

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
})
