import { nextTick } from 'vue-demi'
import { useCounter } from '../../shared/useCounter'
import { useSetup } from '../../.test'
import { events } from './internal'
import { useEventBus } from '.'

describe('useEventBus', () => {
  const emptyMap = new Map()
  it('on event and off listener', () => {
    const { on, off } = useEventBus<number>('foo')
    const { inc } = useCounter(0)
    on(inc)
    off(inc)
    expect(events).toEqual(emptyMap)
  })
  it('on event', () => {
    let event = false
    const { emit, on, reset } = useEventBus<boolean>('on-event')
    on((_event) => {
      event = _event
    })
    emit(true)
    expect(event).toBe(true)
    reset()
    expect(events).toEqual(emptyMap)
  })
  it('once event', () => {
    const { once, emit, reset } = useEventBus<number>('foo')
    const { inc, count } = useCounter(0)
    once(inc)
    emit()
    emit()
    emit()
    expect(count.value).toBe(1)
    reset()
    expect(events).toEqual(emptyMap)
  })
  it('on callback off event', () => {
    const bus = useEventBus<number>('on-callback-off')
    const { count, inc } = useCounter(0)
    const off = bus.on(inc)
    bus.on(inc)
    off()
    bus.emit()
    bus.reset()
    expect(count.value).toBe(1)
    expect(events).toEqual(emptyMap)
  })
  it('useEventBus off event', () => {
    const { emit, on, reset } = useEventBus<number>('useEventBus-off')
    const { count, inc } = useCounter(0)
    on(inc)
    on(inc)
    on(inc)

    emit()
    reset()

    on(inc)
    on(inc)

    emit()
    reset()

    expect(count.value).toBe(5)
    expect(events).toEqual(emptyMap)
  })
  it('event off event', () => {
    const event1 = useEventBus<number>('event-off-1')
    const event2 = useEventBus<number>('event-off-2')
    const { count, inc } = useCounter(0)
    event1.on(inc)
    event2.on(inc)
    event1.emit() // 1
    event2.emit() // 2

    event1.reset()

    event1.on(inc)
    event2.on(inc)
    event1.emit() // 3
    event2.emit() // 5

    event1.reset()
    event2.reset()

    expect(count.value).toBe(5)
    expect(events).toEqual(emptyMap)
  })

  it('setup unmount off', async () => {
    const vm = useSetup(() => {
      const { on } = useEventBus('setup-unmount')
      on(() => {})
      on(() => {})
      on(() => {})
      on(() => {})
      on(() => {})
    })
    expect(events).not.toEqual(emptyMap)
    vm.unmount()
    await nextTick()
    expect(events).toEqual(emptyMap)
  })

  it('should work with payload', async () => {
    const { on, emit } = useEventBus<'inc' | 'dec', number>('counter')
    const counter = useCounter(0)
    on((event, payload) => counter[event](payload))
    emit('inc', 3)
    expect(counter.count.value).toBe(3)
    emit('dec', 1)
    expect(counter.count.value).toBe(2)
  })
})
