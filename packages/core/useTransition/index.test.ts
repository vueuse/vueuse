import { promiseTimeout } from '@vueuse/shared'
import { ref } from 'vue-demi'
import { executeTransition, useTransition } from '.'

const expectBetween = (val: number, floor: number, ceiling: number) => {
  expect(val).to.be.greaterThan(floor)
  expect(val).to.be.lessThan(ceiling)
}

describe('executeTransition', () => {
  it('transitions between numbers', async () => {
    const source = ref(0)

    const trans = executeTransition(source, 0, 1, { duration: 50 })

    await promiseTimeout(25)

    expectBetween(source.value, 0.25, 0.75)

    await trans

    expect(source.value).toBe(1)
  })

  it('transitions between vectors', async () => {
    const source = ref([0, 0, 0])

    const trans = executeTransition(source, [0, 1, 2], [1, 2, 3], { duration: 50 })

    await promiseTimeout(25)

    expectBetween(source.value[0], 0, 1)
    expectBetween(source.value[1], 1, 2)
    expectBetween(source.value[2], 2, 3)

    await trans

    expect(source.value[0]).toBe(1)
    expect(source.value[1]).toBe(2)
    expect(source.value[2]).toBe(3)
  })

  it('transitions can be aborted', async () => {
    let abort = false

    const source = ref(0)

    const trans = executeTransition(source, 0, 1, {
      abort: () => abort,
      duration: 50,
    })

    await promiseTimeout(25)

    abort = true

    await trans

    expectBetween(source.value, 0, 1)
  })
})

describe('useTransition', () => {
  it('transitions between numbers', async () => {
    const source = ref(0)
    const transition = useTransition(source, { duration: 100 })

    expect(transition.value).toBe(0)

    source.value = 1

    await promiseTimeout(50)
    expectBetween(transition.value, 0, 1)

    await promiseTimeout(100)
    expect(transition.value).toBe(1)
  })

  it('transitions between vectors', async () => {
    const source = ref([0, 0])
    const transition = useTransition(source, { duration: 100 })

    expect(transition.value).toEqual([0, 0])

    source.value = [1, 1]

    await promiseTimeout(50)
    expectBetween(transition.value[0], 0, 1)
    expectBetween(transition.value[1], 0, 1)

    await promiseTimeout(100)
    expect(transition.value[0]).toBe(1)
    expect(transition.value[1]).toBe(1)
  })

  it('transitions between refs', async () => {
    const source1 = ref(0)
    const source2 = ref(0)
    const transition = useTransition([source1, source2], { duration: 100 })

    expect(transition.value).toEqual([0, 0])

    source1.value = 1
    source2.value = 1

    await promiseTimeout(50)
    expectBetween(transition.value[0], 0, 1)
    expectBetween(transition.value[1], 0, 1)

    await promiseTimeout(100)
    expect(transition.value[0]).toBe(1)
    expect(transition.value[1]).toBe(1)
  })

  it('supports cubic bezier curves', async () => {
    const source = ref(0)

    // https://cubic-bezier.com/#0,2,0,1
    const easeOutBack = useTransition(source, {
      duration: 100,
      transition: [0, 2, 0, 1],
    })

    // https://cubic-bezier.com/#1,0,1,-1
    const easeInBack = useTransition(source, {
      duration: 100,
      transition: [1, 0, 1, -1],
    })

    source.value = 1

    await promiseTimeout(50)
    expectBetween(easeOutBack.value, 1, 2)
    expectBetween(easeInBack.value, -1, 0)

    await promiseTimeout(100)
    expect(easeOutBack.value).toBe(1)
    expect(easeInBack.value).toBe(1)
  })

  it('supports custom easing functions', async () => {
    const source = ref(0)
    const linear = vitest.fn(n => n)
    const transition = useTransition(source, {
      duration: 100,
      transition: linear,
    })

    expect(linear).not.toBeCalled()

    source.value = 1

    await promiseTimeout(50)
    expect(linear).toBeCalled()
    expectBetween(transition.value, 0, 1)

    await promiseTimeout(100)
    expect(transition.value).toBe(1)
  })

  it('supports delayed transitions', async () => {
    const source = ref(0)

    const transition = useTransition(source, {
      delay: 100,
      duration: 100,
    })

    source.value = 1

    await promiseTimeout(50)
    expect(transition.value).toBe(0)

    await promiseTimeout(100)
    expectBetween(transition.value, 0, 1)
  })

  it('supports dynamic transitions', async () => {
    const source = ref(0)
    const first = vitest.fn(n => n)
    const second = vitest.fn(n => n)
    const easingFn = ref(first)

    useTransition(source, {
      duration: 100,
      transition: easingFn,
    })

    expect(first).not.toBeCalled()
    expect(second).not.toBeCalled()

    source.value = 1

    await promiseTimeout(50)
    expect(first).toBeCalled()
    expect(second).not.toBeCalled()

    first.mockReset()
    second.mockReset()

    easingFn.value = second
    source.value = 2

    await promiseTimeout(100)
    expect(first).not.toBeCalled()
    expect(second).toBeCalled()
  })

  it('supports dynamic durations', async () => {
    const source = ref(0)
    const duration = ref(100)
    const transition = useTransition(source, { duration })

    source.value = 1

    await promiseTimeout(50)
    expectBetween(transition.value, 0, 1)

    await promiseTimeout(100)
    expect(transition.value).toBe(1)

    duration.value = 200
    source.value = 2

    await promiseTimeout(150)
    expectBetween(transition.value, 1, 2)

    await promiseTimeout(100)
    expect(transition.value).toBe(2)
  })

  it('fires onStarted and onFinished callbacks', async () => {
    const source = ref(0)
    const onStarted = vitest.fn()
    const onFinished = vitest.fn()

    useTransition(source, {
      duration: 100,
      onStarted,
      onFinished,
    })

    expect(onStarted).not.toBeCalled()
    expect(onFinished).not.toBeCalled()

    source.value = 1

    await promiseTimeout(50)
    expect(onStarted).toBeCalled()
    expect(onFinished).not.toBeCalled()

    onStarted.mockReset()
    onFinished.mockReset()

    await promiseTimeout(100)
    expect(onStarted).not.toBeCalled()
    expect(onFinished).toBeCalled()
  })

  it('clears pending transitions before starting a new one', async () => {
    const source = ref(0)
    const onStarted = vitest.fn()
    const onFinished = vitest.fn()

    useTransition(source, {
      delay: 100,
      duration: 100,
      onFinished,
      onStarted,
    })

    await promiseTimeout(150)
    expect(onStarted).not.toBeCalled()
    source.value = 1
    await promiseTimeout(50)
    source.value = 2
    await promiseTimeout(250)
    expect(onStarted).toBeCalledTimes(1)
    expect(onFinished).toBeCalledTimes(1)
  })

  it('can be disabled for sychronous changes', async () => {
    const onStarted = vitest.fn()
    const disabled = ref(false)
    const source = ref(0)

    const transition = useTransition(source, {
      disabled,
      duration: 100,
      onStarted,
    })

    disabled.value = true
    source.value = 1

    expect(transition.value).toBe(1)
    await promiseTimeout(150)
    expect(onStarted).not.toBeCalled()
    disabled.value = false
    expect(transition.value).toBe(1)
  })

  it('begins transition from where previous transition was interrupted', async () => {
    const source = ref(0)

    const transition = useTransition(source, {
      duration: 100,
    })

    source.value = 1

    await promiseTimeout(50)

    source.value = 0

    await promiseTimeout(25)

    expectBetween(transition.value, 0, 0.5)
  })
})
