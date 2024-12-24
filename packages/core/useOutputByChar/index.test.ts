import { describe, expect, it } from 'vitest'
import { promiseTimeout } from '@vueuse/shared'
import { useOutputByChar } from './index'

describe('useOutputByChar', () => {
  it('should be defined', () => {
    expect(useOutputByChar).toBeDefined()
  })

  it('should be update output', async () => {
    const { showText, pending, start, stop, done, clear } = useOutputByChar(20, 1)

    expect(showText.value).toBe('')
    expect(pending.value).toBe(false)

    start('test start')
    expect(pending.value).toBe(true)

    await promiseTimeout(20)
    expect(showText.value).toBe('t')

    await promiseTimeout(99)
    expect(showText.value).toBe('test ')

    await promiseTimeout(101)
    expect(showText.value).toBe('test start')

    await promiseTimeout(20)
    expect(showText.value).toBe('test start')
    expect(pending.value).toBe(true)

    expect(done()).toBe('test start')
    expect(showText.value).toBe('test start')
    expect(pending.value).toBe(false)

    clear()
    expect(showText.value).toBe('')
    expect(pending.value).toBe(false)

    start('test stop')
    expect(pending.value).toBe(true)
    await promiseTimeout(90)
    expect(showText.value).toBe('test')
    stop()
    expect(pending.value).toBe(false)
    await promiseTimeout(20)
    expect(showText.value).toBe('test')
    start('')
    expect(pending.value).toBe(true)
    await promiseTimeout(101)
    expect(showText.value).toBe('test sto')

    expect(done()).toBe('test stop')
    expect(showText.value).toBe('test stop')
  })
})
