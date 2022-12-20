import { promiseTimeout } from '@vueuse/shared'
import { useAsyncExpiringRef, useExpiringRef } from '.'

describe('useCounter', () => {
  it('should be defined', () => {
    expect(useAsyncExpiringRef).toBeDefined()
    expect(useExpiringRef).toBeDefined()
  })

  it('should expire only after timeout', async () => {
    const [eRef, _] = useExpiringRef(50)
    expect(eRef.value).toBeUndefined()

    eRef.value = 1
    expect(eRef.value).toBe(1)
    await promiseTimeout(20)
    expect(eRef.value).toBe(1)
    await promiseTimeout(50)
    expect(eRef.value).toBeUndefined()

    eRef.value = 2
    await promiseTimeout(20)
    expect(eRef.value).toBe(2)
    eRef.value = 3
    await promiseTimeout(20)
    expect(eRef.value).toBe(3)
    await promiseTimeout(50)
    expect(eRef.value).toBeUndefined()
  })

  it('should extend timeout', async () => {
    const [eRef, setMs] = useExpiringRef(50)
    expect(eRef.value).toBeUndefined()

    eRef.value = 1
    expect(eRef.value).toBe(1)
    await promiseTimeout(20)
    expect(eRef.value).toBe(1)
    setMs(100)
    await promiseTimeout(50)
    expect(eRef.value).toBe(1)
  })

  it('should update async expiring ref value after timeout', async () => {
    let counter = 0
    const eaRef = useAsyncExpiringRef(() => {
      counter += 1
      return [counter, 50]
    })

    expect(await eaRef.value).toBe(1)
    await promiseTimeout(20)
    expect(await eaRef.value).toBe(1)
    await promiseTimeout(50)
    expect(await eaRef.value).toBe(2)
    await promiseTimeout(60)
    expect(await eaRef.value).toBe(3)
  })
})
