import { onUnmounted } from 'vue'
import { useEventBus } from '.'
import { useCounter } from '..'
import { useSetup } from '../../.test'

describe('useEventBus', () => {
  const emptyMap = new Map()
  it('should be defined', () => {
    expect(useEventBus).toBeDefined()
  })

  it('useEventBus subject', () => {
    const counter = useCounter()
    const { attach, notify, detach } = useEventBus.subject
    attach('subject', counter.inc)
    notify('subject')
    detach('subject')
    expect(counter.count.value).toBe(1)
    expect(useEventBus.observers).toEqual(emptyMap)
  })

  it('once event', () => {
    const { emit, once, off } = useEventBus('once-event')
    const { count, inc } = useCounter(0)
    once(inc)
    emit()
    emit()
    emit()
    off()
    expect(count.value).toBe(1)
    expect(useEventBus.observers).toEqual(emptyMap)
  })

  it('on event', (done) => {
    const { emit, on, off } = useEventBus<boolean>('on-event')
    on((message) => {
      expect(message).toBeTruthy()
      done()
    })
    emit(true)
    off()
  })

  it('once callback off event', () => {
    const bus = useEventBus('once-callback-off')
    const { count, inc } = useCounter(0)
    const off = bus.on(inc)
    off()
    expect(count.value).toBe(0)
    expect(useEventBus.observers).toEqual(emptyMap)
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
    expect(useEventBus.observers).toEqual(emptyMap)
  })

  it('useEventBus off event', (done) => {
    const { emit, on, off } = useEventBus('useEventBus-off')
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
    expect(useEventBus.observers).toEqual(emptyMap)
    done()
  })

  it('event off event', (done) => {
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
    expect(useEventBus.observers).toEqual(emptyMap)
    done()
  })

  it('setup unmount off', () => {
    const vm = useSetup(() => {
      const { on } = useEventBus('setup-unmount')
      on(() => { })
      on(() => { })
      on(() => { })
      on(() => { })
      on(() => { })
      onUnmounted(() => {
        expect(useEventBus.observers).toEqual(emptyMap)
      })
    })
    vm.unmount()
  })
})
