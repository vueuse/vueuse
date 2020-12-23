import { ref } from 'vue-demi'
import { useSetup } from '../../_tests'
import { useTransition, TransitionPresets } from '.'
import { promiseTimeout } from '../../shared/utils'

describe('useTransition', () => {
  it('transitions between values', (done) => {
    const vm = useSetup(() => {
      const baseValue = ref(0)

      const transitionedValue = useTransition(baseValue, {
        duration: 80,
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

  it('exposes named presets', (done) => {
    const vm = useSetup(() => {
      const baseValue = ref(0)

      const transitionedValue = useTransition(baseValue, {
        duration: 80,
        transition: TransitionPresets.linear,
      })

      return {
        baseValue,
        transitionedValue,
      }
    })

    vm.baseValue = 1

    setTimeout(() => {
      expect(vm.transitionedValue > 0 && vm.transitionedValue < 1).toBe(true)

      setTimeout(() => {
        expect(vm.transitionedValue).toBe(1)
        done()
      }, 100)
    }, 50)
  })

  it('supports custom function transitions', (done) => {
    const vm = useSetup(() => {
      const baseValue = ref(0)

      const transitionedValue = useTransition(baseValue, {
        duration: 80,
        transition: n => n,
      })

      return {
        baseValue,
        transitionedValue,
      }
    })

    vm.baseValue = 1

    setTimeout(() => {
      expect(vm.transitionedValue > 0 && vm.transitionedValue < 1).toBe(true)

      setTimeout(() => {
        expect(vm.transitionedValue).toBe(1)
        done()
      }, 100)
    }, 50)
  })

  it('support dynamic transition durations', async() => {
    const vm = useSetup(() => {
      const baseValue = ref(0)
      const duration = ref(100)

      const transitionedValue = useTransition(baseValue, {
        duration,
        transition: n => n,
      })

      return {
        baseValue,
        duration,
        transitionedValue,
      }
    })

    // first transition should take 100ms
    vm.baseValue = 1
    await promiseTimeout(150)
    expect(vm.transitionedValue).toBe(1)

    // second transition should take 200ms
    vm.duration = 200
    vm.baseValue = 2
    await promiseTimeout(150)
    expect(vm.transitionedValue < 2).toBe(true)
    await promiseTimeout(100)
    expect(vm.transitionedValue).toBe(2)
  })
})
