import { describe, expect, it } from 'vitest'
import { ref as deepRef, shallowRef } from 'vue'
import { computedWithControl, controlledComputed } from './index'

describe('computedWithControl', () => {
  it('should export', () => {
    expect(computedWithControl).toBeDefined()
    expect(controlledComputed).toBeDefined()
  })

  it('should work', () => {
    const trigger = shallowRef(0)
    const data = shallowRef('foo')

    const computed = computedWithControl(trigger, () => data.value.toUpperCase())

    expect(computed.value).toBe('FOO')

    data.value = 'bar'

    expect(computed.value).toBe('FOO')

    trigger.value += 1

    expect(computed.value).toBe('BAR')
  })

  it('optional old value', () => {
    const trigger = shallowRef(0)

    const computed = computedWithControl(trigger, (oldValue?: number) =>
      oldValue ? oldValue * 2 : 1)

    expect(computed.value).toBe(1)

    trigger.value += 1

    expect(computed.value).toBe(2)

    trigger.value -= 1

    expect(computed.value).toBe(4)
  })

  it('custom trigger', () => {
    let count = 0
    const computed = computedWithControl(() => {}, () => count)

    expect(computed.value).toBe(0)

    count += 1

    expect(computed.value).toBe(0)

    computed.trigger()

    expect(computed.value).toBe(1)
  })

  it('getter and setter', () => {
    const trigger = shallowRef(0)
    const data = shallowRef('foo')

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

  it('shallow watches by default', () => {
    const trigger = deepRef({ a: 1 })

    const computed = computedWithControl(trigger, () => trigger.value.a)

    expect(computed.value).toBe(1)

    trigger.value.a = 42

    expect(computed.value).toBe(1)
  })

  it('can deep watch if specified', () => {
    const trigger = deepRef({ a: 1 })

    const computed = computedWithControl(trigger, () => trigger.value.a, { deep: true })

    expect(computed.value).toBe(1)

    trigger.value.a = 42

    expect(computed.value).toBe(42)
  })

  it('can watch an array of multiple sources', () => {
    const trigger1 = shallowRef(1)
    const trigger2 = shallowRef('2')

    const computed = computedWithControl([trigger1, trigger2], () => trigger1.value + trigger2.value)

    expect(computed.value).toBe('12')

    trigger1.value = 2

    expect(computed.value).toBe('22')
  })
})
