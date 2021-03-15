import { nextTick, ref } from 'vue-demi'
import { promiseTimeout } from '@vueuse/shared'
import { useTransition, TransitionPresets } from '.'

describe('useTransition', () => {
  it('transitions between values', async() => {
    const baseValue = ref(0)

    const transitionedValue = useTransition(baseValue, {
      duration: 80,
      transition: [0, 0, 1, 1], // a simple linear transition
    })

    // both values should start at zero
    expect(baseValue.value).toBe(0)
    expect(transitionedValue.value).toBe(0)

    // changing the base value should start the transition
    baseValue.value = 1

    // half way through the transition the base value should be 1,
    // and the transitioned value should be approximately 0.5
    await promiseTimeout(50)
    expect(baseValue.value).toBe(1)
    expect(transitionedValue.value > 0 && transitionedValue.value < 1).toBe(true)

    // once the transition is complete, both values should be 1
    await promiseTimeout(100)
    expect(baseValue.value).toBe(1)
    expect(transitionedValue.value).toBe(1)
  })

  it('exposes named presets', async() => {
    const baseValue = ref(0)

    const transitionedValue = useTransition(baseValue, {
      duration: 80,
      transition: TransitionPresets.linear,
    })

    baseValue.value = 1

    await promiseTimeout(50)
    expect(transitionedValue.value > 0 && transitionedValue.value < 1).toBe(true)

    await promiseTimeout(100)
    expect(transitionedValue.value).toBe(1)
  })

  it('supports custom function transitions', async() => {
    const baseValue = ref(0)

    const transitionedValue = useTransition(baseValue, {
      duration: 80,
      transition: n => n,
    })

    baseValue.value = 1

    await promiseTimeout(50)
    expect(transitionedValue.value > 0 && transitionedValue.value < 1).toBe(true)

    await promiseTimeout(100)
    expect(transitionedValue.value).toBe(1)
  })

  it('supports dynamic transitions', async() => {
    const linear = jest.fn(n => n)
    const easeInQuad = jest.fn(n => n * n)
    const baseValue = ref(0)
    const transition = ref(linear)

    useTransition(baseValue, {
      duration: 100,
      transition,
    })

    expect(linear).not.toHaveBeenCalled()
    expect(easeInQuad).not.toHaveBeenCalled()

    baseValue.value++
    await nextTick()

    expect(linear).toHaveBeenCalled()
    expect(easeInQuad).not.toHaveBeenCalled()

    transition.value = easeInQuad
    baseValue.value++
    await nextTick()

    expect(easeInQuad).toHaveBeenCalled()
  })

  it('support dynamic transition durations', async() => {
    const baseValue = ref(0)
    const duration = ref(100)

    const transitionedValue = useTransition(baseValue, {
      duration,
      transition: n => n,
    })

    // first transition should take 100ms
    baseValue.value = 1

    await promiseTimeout(150)
    expect(transitionedValue.value).toBe(1)

    // second transition should take 200ms
    duration.value = 200
    baseValue.value = 2

    await promiseTimeout(150)
    expect(transitionedValue.value < 2).toBe(true)

    await promiseTimeout(100)
    expect(transitionedValue.value).toBe(2)
  })

  it('calls onStarted and onFinished callbacks', async() => {
    const onStarted = jest.fn()
    const onFinished = jest.fn()

    const baseValue = ref(0)

    useTransition(baseValue, {
      duration: 100,
      onFinished,
      onStarted,
      transition: n => n,
    })

    expect(onStarted).not.toHaveBeenCalled()
    expect(onFinished).not.toHaveBeenCalled()

    baseValue.value = 1
    await nextTick()

    expect(onStarted).toHaveBeenCalled()
    expect(onFinished).not.toHaveBeenCalled()

    await promiseTimeout(150)
    expect(onStarted.mock.calls.length).toBe(1)
    expect(onFinished.mock.calls.length).toBe(1)
  })

  it('transitions between vectors', async() => {
    const vm = useSetup(() => {
      const baseVector = ref([0, 0])

      const transitionedVector = useTransition(baseVector, {
        duration: 100,
      })

      return {
        baseVector,
        transitionedVector,
      }
    })

    expect(vm.transitionedVector).toEqual([0, 0])

    vm.baseVector = [1, 1]

    await promiseTimeout(50)
    expect(vm.transitionedVector[0] > 0 && vm.transitionedVector[0] < 1).toBe(true)
    expect(vm.transitionedVector[1] > 0 && vm.transitionedVector[1] < 1).toBe(true)

    await promiseTimeout(100)
    expect(vm.transitionedVector).toEqual([1, 1])

    vm.baseVector.splice(0, 1, 0)

    await promiseTimeout(50)
    expect(vm.transitionedVector[0] > 0 && vm.transitionedVector[0] < 1).toBe(true)

    await promiseTimeout(100)
    expect(vm.transitionedVector).toEqual([0, 1])
  })
})
