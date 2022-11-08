import { isVue3, ref } from 'vue-demi'
import { computedWithControl, controlledComputed } from '.'

describe('computedWithControl', () => {
  it('should export', () => {
    expect(computedWithControl).toBeDefined()
    expect(controlledComputed).toBeDefined()
  })

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

  it.runIf(isVue3)('custom trigger', () => {
    let count = 0
    const computed = computedWithControl(() => {}, () => count)

    expect(computed.value).toBe(0)

    count += 1

    expect(computed.value).toBe(0)

    computed.trigger()

    expect(computed.value).toBe(1)
  })

  it('getter and setter', () => {
    const trigger = ref(0)
    const data = ref('foo')

    const computed = computedWithControl(trigger, {
      get() {
        return data.value.toUpperCase()
      },
      set(v) {
        data.value = v
      },
    })

    expect(computed.value).toBe('FOO')

    data.value = 'bar'

    expect(computed.value).toBe('FOO')

    trigger.value += 1

    expect(computed.value).toBe('BAR')

    computed.value = 'BAZ'

    expect(data.value).toBe('BAZ')
  })
})
