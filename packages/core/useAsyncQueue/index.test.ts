import { ref } from 'vue-demi'
import { until } from '@vueuse/shared'
import { useAsyncQueue } from '.'

describe('useAsyncQueue', () => {
  const p1 = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(1000)
      }, 10)
    })
  }

  const p2 = (result: number) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(1000 + result)
      }, 20)
    })
  }

  const p3 = (result: number) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(1000 + result)
      }, 30)
    })
  }

  const p4 = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('e'))
      }, 30)
    })
  }

  it ('should return the tasks result', async() => {
    const {
      activeIndex,
      result,
    } = useAsyncQueue([p1, p2, p3])
    await until(activeIndex).toBe(2)
    expect(JSON.stringify(result)).toBe('[{"state":"fulfilled","data":1000},{"state":"fulfilled","data":2000},{"state":"fulfilled","data":3000}]')
  })

  it ('should passed the current task result to the next task', async() => {
    const {
      activeIndex,
      result,
    } = useAsyncQueue([p1, p2])
    await until(activeIndex).toBe(1)
    expect(result[activeIndex.value].data).toBe(2000)
  })

  it ('should trigger onFinished when the tasks ends', async() => {
    const spy = jest.fn()
    const {
      activeIndex,
    } = useAsyncQueue([p1, p2], {
      onFinished: spy,
    })
    await until(activeIndex).toBe(1)
    expect(spy).toBeCalledTimes(1)
  })

  it ('should trigger onError when the tasks fails', async() => {
    const spy = jest.fn()
    const {
      activeIndex,
    } = useAsyncQueue([p3, p4], {
      onError: spy,
    })
    await until(activeIndex).toBe(1)
    expect(spy).toBeCalledTimes(1)
  })

  it ('should interrupt the tasks when current task fails', async() => {
    const spy = jest.fn(() => Promise.resolve('data'))
    const finished = ref(0)
    useAsyncQueue([p1, p4, spy], {
      onFinished: () => {
        finished.value = 1
      },
    })
    await until(finished).toBe(1)
    expect(spy).toBeCalledTimes(0)
  })

  it ('should not interrupt the tasks when current task fails', async() => {
    const spy = jest.fn(() => Promise.resolve('data'))
    const finished = ref(0)
    useAsyncQueue([p1, p4, spy], {
      interrupt: false,
      onFinished: () => {
        finished.value = 1
      },
    })
    await until(finished).toBe(1)
    expect(spy).toBeCalledTimes(1)
  })
})
