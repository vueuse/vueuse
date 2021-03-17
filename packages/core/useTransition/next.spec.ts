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

  it.todo('transitions between vectors')

  it.todo('supports cubic bezier curves')

  it.todo('supports custom easing functions')

  it.todo('supports dynamic transitions')

  it.todo('supports dynamic durations')

  it.todo('fires onStarted and onFinished callbacks')
})
