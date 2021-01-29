/* eslint-disable no-unused-expressions */
import { isRef, isVue2, watch, watchEffect } from 'vue-demi'
import { controlledRef } from '.'
import { useSetup } from '../../.test'

describe('controlledRef', () => {
  if (isVue2) {
    it('skipped', () => {})
    return
  }
  it('should act like normal ref', () => {
    useSetup(() => {
      let dummy = 0
      const ref = controlledRef(0)

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
  })

  it('should be able to set without triggering', () => {
    useSetup(() => {
      let dummy = 0
      const ref = controlledRef(0)

      watch(ref, () => {
        dummy += 1
      }, { flush: 'sync' })

      expect(ref.value).toBe(0)
      expect(dummy).toBe(0)

      ref.lay(42)

      expect(ref.value).toBe(42)
      expect(dummy).toBe(0)

      ref.set(10)

      expect(ref.value).toBe(10)
      expect(dummy).toBe(1)
    })
  })

  it('should be able to get without tracking', () => {
    useSetup(() => {
      let dummy1 = 0
      let dummy2 = 0
      const ref = controlledRef(0)

      watchEffect(() => {
        ref.get()
        dummy1 += 1
      })

      watchEffect(() => {
        ref.peek()
        dummy2 += 1
      })

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
  })

  it('should be able to dismiss changes', () => {
    useSetup(() => {
      let dummy = 0
      let dismissed = 0

      const ref = controlledRef(0, {
        onBeforeChange(value, oldValue) {
          // disallow changes larger then ±5 in one operation
          if (Math.abs(value - oldValue) > 5) {
            dismissed += 1
            return false
          }
        },
      })

      watchEffect(() => {
        ref.value
        dummy += 1
      })

      expect(ref.value).toBe(0)
      expect(dummy).toBe(1)

      ref.value += 1

      expect(ref.value).toBe(1)
      expect(dummy).toBe(2)
      expect(dismissed).toBe(0)

      ref.value += 6

      expect(ref.value).toBe(1)
      expect(dummy).toBe(2)
      expect(dismissed).toBe(1)

      ref.value -= 5

      expect(ref.value).toBe(-4)
      expect(dummy).toBe(3)
      expect(dismissed).toBe(1)
    })
  })
})
