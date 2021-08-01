
import { onUnmounted } from 'vue'
import { useCounter } from '..'
import { useSetup } from '../../.test'
import { useEventBus } from '.'

describe('useEventBus', () => {
  const emptyMap = new Map()
  it('on event and off listener', () => {
    const { on, off, all } = useEventBus('foo')
    const { inc } = useCounter(0)
    on(inc)
    off(inc)
    expect(all).toEqual(emptyMap)
  })
  it('on event', (done) => {
    const { emit, on, off, all } = useEventBus<boolean>('on-event')
    on((message) => {
      expect(message).toBeTruthy()
      done()
    })
    emit(true)
    off()
    expect(all).toEqual(emptyMap)
  })
  it('on callback off event', () => {
    const bus = useEventBus('on-callback-off')
    const { count, inc } = useCounter(0)
    const off = bus.on(inc)
    bus.on(inc)
    off()
    bus.emit()
    bus.off()
    expect(count.value).toBe(1)
    expect(bus.all).toEqual(emptyMap)
  })
  it('useEventBus off event', () => {
    const { emit, on, off, all } = useEventBus('useEventBus-off')
    const { count, inc } = useCounter(0)
    on(inc)
    on(inc)
    on(inc)

    emit()
    off()

    on(inc)
    on(inc)

    emit()
    off()

    expect(count.value).toBe(5)
    expect(all).toEqual(emptyMap)
  })
  it('event off event', () => {
    const event1 = useEventBus('event-off-1')
    const event2 = useEventBus('event-off-2')
    const { count, inc } = useCounter(0)
    event1.on(inc)
    event2.on(inc)
    event1.emit() // 1
    event2.emit() // 2

    event1.off('event-off-1')

    event1.on(inc)
    event2.on(inc)
    event1.emit() // 3
    event2.emit() // 5

    event1.off('event-off-1')
    // event1 cancels all ons of event2
    event1.off('event-off-2')

    expect(count.value).toBe(5)
    expect(event1.all).toEqual(emptyMap)
  })
  it('setup unmount off', () => {
    const vm = useSetup(() => {
      const { on, all } = useEventBus('setup-unmount')
      on(() => { })
      on(() => { })
      on(() => { })
      on(() => { })
      on(() => { })
      onUnmounted(() => {
        expect(all).toEqual(emptyMap)
      })
    })
    vm.unmount()
  })
})
