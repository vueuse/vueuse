/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ref } from 'vue-demi'
import { toReadonly } from '.'

describe('toReadonly', () => {
  const warnSpy = vitest.spyOn(global.console, 'warn').mockImplementation(() => {})

  beforeEach(() => {
    warnSpy.mockReset()
  })

  afterAll(() => {
    warnSpy.mockRestore()
  })

  it('ref', () => {
    const count = ref(0)
    const readonlyCount = toReadonly(count)

    expect(readonlyCount.value).toBe(0)

    count.value += 1

    expect(warnSpy).not.toBeCalled()
    expect(readonlyCount.value).toBe(1)

    // @ts-expect-error
    readonlyCount.value = 123

    expect(warnSpy).toBeCalledTimes(1)
    expect(readonlyCount.value).toBe(1)
  })

  it('refs in object', () => {
    const count = ref(0)
    const msg = ref('foo')
    const obj = toReadonly({
      count,
      msg,
    })

    expect(obj.count.value).toBe(0)
    expect(obj.msg.value).toBe('foo')

    // @ts-expect-error
    obj.count.value = 123
    // @ts-expect-error
    obj.msg.value = 'bar'

    expect(warnSpy).toBeCalledTimes(2)
    expect(obj.count.value).toBe(0)
    expect(obj.msg.value).toBe('foo')
  })

  it('none ref in object', () => {
    const user = {
      name: 'vueuse',
      age: 3,
    }
    const fn = () => {}
    const obj = toReadonly({
      user,
      fn,
    })

    expect(obj.user).toBe(user)
    expect(obj.fn).toBe(fn)
  })

  it('refs in array', () => {
    const count = ref(0)
    const foo = {}
    const [bar, readonlyCount] = toReadonly([foo, count])

    expect(bar).toBe(foo)

    // @ts-expect-error
    readonlyCount.value = 123

    expect(readonlyCount.value).toBe(0)
  })

  it('destructure', () => {
    const count = ref(0)
    const { countReadonly } = toReadonly({
      countReadonly: count,
    })

    expect(countReadonly.value).toBe(0)

    // @ts-expect-error
    countReadonly.value = 1

    expect(countReadonly.value).toBe(0)

    count.value = 1

    expect(countReadonly.value).toBe(1)
  })
})
