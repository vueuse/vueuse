import { ref } from 'vue-demi'
import { useSetup } from '../../_tests'
import { useTransition, TransitionPresets } from '.'
import { promiseTimeout } from '../../shared/utils'

describe('useTransition', () => {
  it('transitions between values', async() => {
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

    // half way through the transition the base value should be 1,
    // and the transitioned value should be approximately 0.5
    await promiseTimeout(50)
    expect(vm.baseValue).toBe(1)
    expect(vm.transitionedValue > 0 && vm.transitionedValue < 1).toBe(true)

    // once the transition is complete, both values should be 1
    await promiseTimeout(100)
    expect(vm.baseValue).toBe(1)
    expect(vm.transitionedValue).toBe(1)
  })

  it('exposes named presets', async() => {
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

    await promiseTimeout(50)
    expect(vm.transitionedValue > 0 && vm.transitionedValue < 1).toBe(true)

    await promiseTimeout(100)
    expect(vm.transitionedValue).toBe(1)
  })

  it('supports custom function transitions', async() => {
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

    await promiseTimeout(50)
    expect(vm.transitionedValue > 0 && vm.transitionedValue < 1).toBe(true)

    await promiseTimeout(100)
    expect(vm.transitionedValue).toBe(1)
  })

  it('supports dynamic transitions', async() => {
    const linear = jest.fn(n => n)
    const easeInQuad = jest.fn(n => n * n)
    const vm = useSetup(() => {
      const baseValue = ref(0)
      const transition = ref(linear)

      const transitionedValue = useTransition(baseValue, {
        duration: 100,
        transition,
      })

      return {
        baseValue,
        transition,
        transitionedValue,
      }
    })

    expect(linear).not.toHaveBeenCalled()
    expect(easeInQuad).not.toHaveBeenCalled()

    vm.baseValue++
    await vm.$nextTick()

    expect(linear).toHaveBeenCalled()
    expect(easeInQuad).not.toHaveBeenCalled()

    vm.transition = easeInQuad
    vm.baseValue++
    await vm.$nextTick()

    expect(easeInQuad).toHaveBeenCalled()
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

  it('calls onStarted and onFinished callbacks', async() => {
    const onStarted = jest.fn()
    const onFinished = jest.fn()

    const vm = useSetup(() => {
      const baseValue = ref(0)

      const transitionedValue = useTransition(baseValue, {
        duration: 100,
        onFinished,
        onStarted,
        transition: n => n,
      })

      return {
        baseValue,
        transitionedValue,
      }
    })

    expect(onStarted).not.toHaveBeenCalled()
    expect(onFinished).not.toHaveBeenCalled()

    vm.baseValue = 1
    await vm.$nextTick()

    expect(onStarted).toHaveBeenCalled()
    expect(onFinished).not.toHaveBeenCalled()

    await promiseTimeout(150)
    expect(onStarted.mock.calls.length).toBe(1)
    expect(onFinished.mock.calls.length).toBe(1)
  })
})
