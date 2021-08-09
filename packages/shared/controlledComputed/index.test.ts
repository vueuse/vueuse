import { ref } from 'vue-demi'
import { useSetup } from '../../.test'
import { controlledComputed } from '.'

describe('controlledComputed', () => {
  it('should work', (done) => {
    useSetup(() => {
      const trigger = ref(0)
      const data = ref('foo')

      const computed = controlledComputed(trigger, () => data.value.toUpperCase())

      expect(computed.value).toBe('FOO')

      data.value = 'bar'

      expect(computed.value).toBe('FOO')

      trigger.value += 1

      expect(computed.value).toBe('BAR')

      done()
    })
  })
})
