import { nextTick, ref } from 'vue-demi'
import { eventRef } from '.'

type FnHandler = (val: number | string) => void

describe('eventRef', () => {
  let _scroll: {
    toString: boolean
    _value: number
    value: number | string
    on: (handler: FnHandler, toString?: boolean) => void
    off: (handler: FnHandler) => void
    handler: FnHandler | undefined
  }

  const _update = (val: number) => {
    _scroll._value = val
    const value = _scroll.toString ? `${val}` : val
    _scroll.handler!(value)
  }

  beforeEach(() => {
    _scroll = {
      toString: false,
      _value: 0,
      get value() {
        if (_scroll.toString) return `${_scroll._value}`
        return _scroll._value
      },
      on: (handler, toString) => {
        expect(_scroll.handler).toBeUndefined()
        expect(handler).toBeDefined()
        _scroll.handler = handler
        _scroll.toString = toString ?? false
      },
      off: (handler) => {
        expect(_scroll.handler).toBe(handler)
        _scroll.handler = undefined
        _scroll.toString = false
      },
      handler: undefined,
    }
  })

  it('should be defined', () => {
    expect(eventRef).toBeDefined()
  })

  it('should reactive by mock event', async() => {
    const [scrollTop] = eventRef<number>((handler) => {
      _scroll.on(handler)
      return () => _scroll.off(handler)
    }, (val?: number) => val ?? _scroll.value as number)

    expect(scrollTop.value).toBe(0)

    _update(10)
    await nextTick()
    expect(scrollTop.value).toBe(10)
  })

  it('should recomputed when getter with reactive value change', async() => {
    const offset = ref(0)

    const [scrollTop] = eventRef<number>((handler) => {
      _scroll.on(handler)
      return () => _scroll.off(handler)
    }, (val?: number) => (val ?? _scroll.value as number) + offset.value)

    expect(scrollTop.value).toBe(0)

    offset.value = 10
    await nextTick()
    expect(scrollTop.value).toBe(10)

    _update(10)
    await nextTick()
    expect(scrollTop.value).toBe(20)
  })

  it('should add listener again when register with reactive value change', async() => {
    const toString = ref(false)

    const [scrollTop] = eventRef<number | string>((handler) => {
      _scroll.on(handler, toString.value)
      return () => _scroll.off(handler)
    }, (val?: number | string) => val ?? _scroll.value)

    expect(scrollTop.value).toBe(0)

    toString.value = true
    await nextTick()
    expect(scrollTop.value).toBe('0')

    _update(10)
    await nextTick()
    expect(scrollTop.value).toBe('10')

    toString.value = false
    await nextTick()
    expect(scrollTop.value).toBe(10)
  })
})
