import { promiseTimeout } from '@vueuse/shared'
import { ref } from 'vue-demi'
import { useTransition } from './next'

const expectBetween = (val: number, floor: number, ceiling: number) => {
  expect(val).toBeGreaterThan(floor)
  expect(val).toBeLessThan(ceiling)
}

describe('useTransition', () => {
  it('transitions between numbers', async() => {
    const source = ref(0)
    const transition = useTransition(source, { duration: 100 })

    expect(transition.value).toBe(0)

    source.value = 1

    await promiseTimeout(50)
    expectBetween(transition.value, 0, 1)

    await promiseTimeout(100)
    expect(transition.value).toBe(1)
  })

  it('transitions between vectors', async() => {
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

  it('supports cubic bezier curves', async() => {
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

  it('supports custom easing functions', async() => {
    const source = ref(0)
    const linear = jest.fn(n => n)
    const transition = useTransition(source, {
      duration: 100,
      transition: linear,
    })

    expect(linear).not.toHaveBeenCalled()

    source.value = 1

    await promiseTimeout(50)
    expect(linear).toHaveBeenCalled()
    expectBetween(transition.value, 0, 1)

    await promiseTimeout(100)
    expect(transition.value).toBe(1)
  })

  it.todo('supports dynamic transitions')

  it.todo('supports dynamic durations')

  it.todo('fires onStarted and onFinished callbacks')
})
