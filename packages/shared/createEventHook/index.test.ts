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

  it('the same listener should fire only once', () => {
    const listener = vitest.fn()
    const { on, trigger, off } = createEventHook<string>()
    on(listener)
    on(listener)
    trigger('xxx')
    off(listener)
    expect(listener).toBeCalledTimes(1)
  })
})
