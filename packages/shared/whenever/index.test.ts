import type { Ref } from 'vue-demi'
import { nextTick, ref } from 'vue-demi'
import { describe, expect, it } from 'vitest'
import { useSetup } from '../../.test'
import { toValue } from '../toValue'
import { whenever } from '.'

describe('whenever', () => {
  const expectType = <T>(value: T) => value

  it('ignore falsy state change', async () => {
    // use a component to simulate normal use case
    const vm = useSetup(() => {
      const number = ref<number | null | undefined>(1)
      const changeNumber = (v: number) => number.value = v
      const watchCount = ref(0)
      const watchValue: Ref<number | undefined> = ref()

      whenever(number, (value) => {
        watchCount.value += 1
        watchValue.value = value

        expectType<number>(value)

        // @ts-expect-error value should be of type number
        expectType<undefined>(value)
        // @ts-expect-error value should be of type number
        expectType<null>(value)
        // @ts-expect-error value should be of type number
        expectType<string>(value)
      })

      return {
        number,
        watchCount,
        watchValue,
        changeNumber,
      }
    })

    expect(toValue(vm.watchCount)).toEqual(0)

    vm.changeNumber(2)
    await nextTick()
    expect(toValue(vm.watchCount)).toEqual(1)
    expect(toValue(vm.watchValue)).toEqual(2)

    vm.changeNumber(0)
    await nextTick()
    expect(toValue(vm.watchCount)).toEqual(1)
    expect(toValue(vm.watchValue)).toEqual(2)

    vm.changeNumber(3)
    await nextTick()
    expect(toValue(vm.watchCount)).toEqual(2)
    expect(toValue(vm.watchValue)).toEqual(3)

    vm.unmount()
  })
})
