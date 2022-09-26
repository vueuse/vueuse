import { isRef, isVue2, watch, watchEffect } from 'vue-demi'
import { controlledRef, refWithControl } from '.'

describe('controlledRef', () => {
  if (isVue2) {
    it('skipped', () => {})
    return
  }

  it('should export module', () => {
    expect(refWithControl).toBeDefined()
    expect(controlledRef).toBeDefined()
  })

  it('should act like normal ref', () => {
    let dummy = 0
    const ref = refWithControl(0)

    watch(ref, () => {
      dummy += 1
    }, { flush: 'sync' })

    expect(ref.value).toBe(0)
    expect(dummy).toBe(0)

    ref.value += 1

    expect(ref.value).toBe(1)
    expect(dummy).toBe(1)

    ref.value = 10

    expect(ref.value).toBe(10)
    expect(dummy).toBe(2)

    expect(isRef(ref)).toBe(true)
  })

  it('should be able to set without triggering', () => {
    let dummy = 0
    const onChanged = vi.fn(() => 0)
    const ref = refWithControl(0, { onChanged })

    watch(ref, () => {
      dummy += 1
    }, { flush: 'sync' })

    expect(ref.value).toBe(0)
    expect(dummy).toBe(0)

    ref.lay(42)
    ref.silentSet(42)

    expect(ref.value).toBe(42)
    expect(dummy).toBe(0)
    expect(onChanged).toHaveBeenCalledWith(42, 0)

    ref.set(10)

    expect(ref.value).toBe(10)
    expect(dummy).toBe(1)
    expect(onChanged).toHaveBeenCalledWith(10, 42)
  })

  it('should be able to get without tracking', () => {
    let dummy1 = 0
    let dummy2 = 0
    const ref = refWithControl(0)

    watchEffect(() => {
      ref.get()
      dummy1 += 1
    }, { flush: 'sync' })

    watchEffect(() => {
      ref.peek()
      ref.untrackedGet()
      dummy2 += 1
    }, { flush: 'sync' })

    expect(ref.value).toBe(0)
    expect(dummy1).toBe(1)
    expect(dummy2).toBe(1)

    ref.value += 1

    expect(ref.value).toBe(1)
    expect(dummy1).toBe(2)
    expect(dummy2).toBe(1)

    ref.set(10)

    expect(ref.value).toBe(10)
    expect(dummy1).toBe(3)
    expect(dummy2).toBe(1)
  })

  it('should be able to dismiss changes', () => {
    let dummy = 0
    let dismissed = 0
    const onChanged = vi.fn(() => 0)
    const ref = refWithControl(0, {
      onBeforeChange(value, oldValue) {
        // disallow changes larger then ±5 in one operation
        if (Math.abs(value - oldValue) > 5) {
          dismissed += 1
          return false
        }
      },
      onChanged,
    })

    watchEffect(() => {
      ref.value
      dummy += 1
    }, { flush: 'sync' })

    expect(ref.value).toBe(0)
    expect(dummy).toBe(1)

    ref.value += 1

    expect(ref.value).toBe(1)
    expect(dummy).toBe(2)
    expect(dismissed).toBe(0)
    expect(onChanged).toHaveBeenCalledWith(1, 0)

    ref.value += 6

    expect(ref.value).toBe(1)
    expect(dummy).toBe(2)
    expect(dismissed).toBe(1)
    expect(onChanged).toHaveBeenCalledTimes(1)

    ref.value -= 5

    expect(ref.value).toBe(-4)
    expect(dummy).toBe(3)
    expect(dismissed).toBe(1)
    expect(onChanged).toHaveBeenCalledWith(-4, 1)
  })
})
