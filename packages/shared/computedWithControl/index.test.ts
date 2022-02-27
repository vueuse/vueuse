import { ref } from 'vue-demi'
import { computedWithControl } from '.'

describe('computedWithControl', () => {
  it('should work', () => {
    const trigger = ref(0)
    const data = ref('foo')

    const computed = computedWithControl(trigger, () => data.value.toUpperCase())

    expect(computed.value).toBe('FOO')

    data.value = 'bar'

    expect(computed.value).toBe('FOO')

    trigger.value += 1

    expect(computed.value).toBe('BAR')
  })
})
