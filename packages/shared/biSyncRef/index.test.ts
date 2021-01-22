import { ref } from 'vue-demi'
import { biSyncRef } from '.'
import { useSetup } from '../../.test'

describe('biSyncRef', () => {
  it('should work', (done) => {
    useSetup(() => {
      const a = ref('foo')
      const b = ref('bar')

      const stop = biSyncRef(a, b)

      expect(b.value).toBe('foo')

      a.value = 'bar'

      expect(a.value).toBe('bar')
      expect(b.value).toBe('bar')

      b.value = 'foo'

      expect(a.value).toBe('foo')
      expect(b.value).toBe('foo')

      stop()

      a.value = 'bar2'

      expect(a.value).toBe('bar2')
      expect(b.value).toBe('foo')

      done()
    })
  })
})
