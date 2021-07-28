import { onUnmounted } from 'vue'
import { useEventBus } from '.'
import { useSetup } from '../../.test'

describe('useEventBus', () => {
  it('should be defined', () => {
    expect(useEventBus).toBeDefined()
  })

  it('once event', () => {
    const { emit, once, off } = useEventBus('once-event')
    let count = 0
    once(() => count++)
    emit()
    emit()
    emit()
    off()
    expect(count).toBe(1)
    expect(useEventBus.observers).toEqual({})
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

  it('token off event', () => {
    const { emit, on, off } = useEventBus('token-off')
    let count = 0
    const unToken = on(() => count++)
    on(() => count++)
    off(unToken)
    emit()
    off()
    expect(count).toBe(1)
    expect(useEventBus.observers).toEqual({})
  })

  it('useEventBus off event', (done) => {
    const { emit, on, off } = useEventBus('useEventBus-off')
    let count = 0
    on(() => count++)
    on(() => count++)
    on(() => count++)

    emit()
    off()

    on(() => count++)
    on(() => count++)

    emit()
    off()

    expect(count).toBe(5)
    expect(useEventBus.observers).toEqual({})
    done()
  })

  it('event off event', (done) => {
    const event1 = useEventBus('event-off-1')
    const event2 = useEventBus('event-off-2')
    let count = 0
    event1.on(() => count++)
    event2.on(() => count++)
    event1.emit() // 1
    event2.emit() // 2

    event1.off('event-off-1')

    event1.on(() => count++)
    event2.on(() => count++)
    event1.emit() // 3
    event2.emit() // 5

    event1.off('event-off-1')
    // event1 cancels all ons of event2
    event1.off('event-off-2')

    expect(count).toBe(5)
    expect(useEventBus.observers).toEqual({})
    done()
  })

  it('setup unmount off', () => {
    const vm = useSetup(() => {
      const { on } = useEventBus('setup-unmount')
      on(() => {})
      on(() => {})
      on(() => {})
      on(() => {})
      on(() => {})
      onUnmounted(() => {
        expect(useEventBus.observers).toEqual({})
      })
    })
    vm.unmount()
  })
})
