import { describe, expect, it, vi } from 'vitest'
import { createEventHook } from '.'

describe('createEventHook', () => {
  it('should be defined', () => {
    expect(createEventHook).toBeDefined()
  })

  it('should trigger event', () => {
    let message = ''

    const myFunction = () => {
      const resultEvent = createEventHook<string>()
      const exec = () => resultEvent.trigger('Hello World')
      return {
        exec,
        onResult: resultEvent.on,
      }
    }

    const { exec, onResult } = myFunction()
    onResult(result => message = result)
    exec()

    setTimeout(() => {}, 0)

    expect(message).toBe('Hello World')
  })

  it('should trigger event with no params', () => {
    let timesFired = 0

    const { on: onResult, trigger } = createEventHook()

    onResult(() => timesFired++)
    trigger()
    trigger()

    expect(timesFired).toBe(2)
  })

  it('should trigger event and pass falsy values', () => {
    let timesFired = 0

    type Falsy = false | 0 | '' | null | undefined
    const { on: onResult, trigger } = createEventHook<Falsy>()

    const values: Falsy[] = [false, 0, '', null, undefined]
    const results: Falsy[] = []
    onResult((value: Falsy) => {
      timesFired++
      results.push(value)
    })
    for (const value of values)
      trigger(value)

    expect(timesFired).toBe(values.length)
    expect(results).toMatchObject(values)
  })

  it('should add and remove event listener', () => {
    const listener = vi.fn()
    const { on, off, trigger } = createEventHook<string>()

    on(listener)

    trigger('xxx')

    expect(listener).toHaveBeenCalledTimes(1)

    off(listener)

    trigger('xxx')

    expect(listener).toHaveBeenCalledTimes(1)

    const { off: remove } = on(listener)

    trigger('xxx')

    expect(listener).toHaveBeenCalledTimes(2)

    remove()

    trigger('xxx')

    expect(listener).toHaveBeenCalledTimes(2)
  })

  it('should await trigger', async () => {
    let message = ''

    const myFunction = () => {
      const resultEvent = createEventHook<string>()
      const exec = () => resultEvent.trigger('Hello World')
      return {
        exec,
        onResult: resultEvent.on,
      }
    }

    const { exec, onResult } = myFunction()
    onResult(result => new Promise<number>((resolve) => {
      setTimeout(() => {
        message = result
        resolve(2)
      }, 100)
    }))
    const result = await exec()

    expect(message).toBe('Hello World')
    expect(result).toEqual([2])
  })

  it('should pass union type', () => {
    let count = 0

    const { on: onResult, trigger } = createEventHook<number | string>()

    // union type should be inferred
    onResult(value => count = 2)
    trigger(1)
    trigger(2)

    expect(count).toBe(2)
  })

  it('the same listener should fire only once', () => {
    const listener = vi.fn()
    const { on, trigger, off } = createEventHook<string>()
    on(listener)
    on(listener)
    trigger('xxx')
    off(listener)
    expect(listener).toBeCalledTimes(1)
  })
})
