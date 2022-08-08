import { expect } from 'vitest'
import { ref } from 'vue'
import { nextTick } from 'vue-demi'
import { watchPromise } from '.'

function wait(time: number) {
  return new Promise((resolve) => {
    setTimeout(() => { resolve(time) }, time)
  })
}

describe('watchPromise', async () => {
  it('works and save order', async () => {
    const source = ref(3)
    const timeouts: number[] = []

    const spy = vi.fn().mockImplementation(() => {
      const time = source.value * 400

      return new Promise(resolve => setTimeout(() => {
        timeouts.push(time)
        resolve('v')
      }, time))
    })

    const { current } = watchPromise(source, spy)

    expect(current.value).toBe(0)

    source.value -= 1
    await nextTick()

    source.value -= 1
    await nextTick()

    await wait(3000)

    expect(spy).toBeCalledTimes(2)
    expect(timeouts).toEqual([800, 400])
  })

  it('works with clean queue function', async () => {
    const source = ref(0)

    const spy = vi.fn().mockImplementation(() => {
      const time = source.value * 1000

      return new Promise(resolve => setTimeout(() => {
        resolve('v')
      }, time))
    })

    const { current, cleanQueue } = watchPromise(source, spy)

    expect(current.value).toBe(0)

    source.value += 1
    await nextTick()

    source.value += 1
    await nextTick()

    cleanQueue()

    await wait(2000)

    expect(current.value).toBe(0)
  })

  it('works with max call queue size option', async () => {
    const source = ref(1)

    const spy = vi.fn().mockImplementation(() => {
      const time = source.value * 1000

      return new Promise(resolve => setTimeout(() => {
        resolve('v')
      }, time))
    })

    const { current } = watchPromise(source, spy, { immediate: true, max: 1 })

    expect(current.value).toBe(1)

    source.value += 1
    source.value += 1

    expect(current.value).toBe(1)
  })
})
