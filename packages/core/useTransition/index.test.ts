import { ref } from 'vue-demi'
import { renderHook } from '../../_docs/tests'
import { useTransition } from '.'

describe('useTransition', () => {
  it('transitions between values', (done) => {
    const { vm } = renderHook(() => {
      const baseValue = ref(0)

      const transitionedValue = useTransition(baseValue, {
        duration: 100,
        transition: [0, 0, 1, 1], // a simple linear transition
      })

      return {
        baseValue,
        transitionedValue,
      }
    })

    // both values should start at zero
    expect(vm.baseValue).toBe(0)
    expect(vm.transitionedValue).toBe(0)

    // changing the base value should start the transition
    vm.baseValue = 1

    setTimeout(() => {
      // half way through the transition the base value should be 1,
      // and the transitioned value should be approximately 0.5
      expect(vm.baseValue).toBe(1)
      expect(vm.transitionedValue > 0 && vm.transitionedValue < 1).toBe(true)

      setTimeout(() => {
        // once the transition is complete, both values should be 1
        expect(vm.baseValue).toBe(1)
        expect(vm.transitionedValue).toBe(1)
        done()
      }, 100)
    }, 50)
  })
})
