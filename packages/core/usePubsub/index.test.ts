import { onUnmounted } from 'vue'
import { usePubsub } from '.'
import { useSetup } from '../../.test'

describe('usePubsub', () => {
  it('should be defined', () => {
    expect(usePubsub).toBeDefined()
  })

  it('subscribe message', (done) => {
    const { publish, subscribe, unsubscribe } = usePubsub<boolean>('subscribe')
    subscribe((message) => {
      expect(message).toBeTruthy()
      done()
    })
    publish(true)
    unsubscribe()
  })

  it('token unsubscribe message', (done) => {
    const { publish, subscribe, unsubscribe } = usePubsub('token-unsubscribe')
    let count = 0
    const unsubToken = subscribe(() => count++)
    subscribe(() => count++)
    unsubscribe(unsubToken)
    publish()
    unsubscribe()
    setTimeout(() => {
      expect(count).toBe(1)
      expect(usePubsub.observes).toEqual({})
      done()
    })
  })

  it('usePubsub unsubscribe message', (done) => {
    const { publish, subscribe, unsubscribe } = usePubsub('usePubsub-unsubscribe')
    let count = 0
    subscribe(() => count++)
    subscribe(() => count++)
    subscribe(() => count++)

    publish()
    unsubscribe()

    subscribe(() => count++)
    subscribe(() => count++)

    publish()
    unsubscribe()

    setTimeout(() => {
      expect(count).toBe(5)
      expect(usePubsub.observes).toEqual({})
      done()
    })
  })

  it('event unsubscribe message', (done) => {
    const pubsub1 = usePubsub('event-unsubscribe-1')
    const pubsub2 = usePubsub('event-unsubscribe-2')
    let count = 0
    pubsub1.subscribe(() => count++)
    pubsub2.subscribe(() => count++)
    pubsub1.publish() // 1
    pubsub2.publish() // 2

    pubsub1.unsubscribe('event-unsubscribe-1')

    pubsub1.subscribe(() => count++)
    pubsub2.subscribe(() => count++)
    pubsub1.publish() // 3
    pubsub2.publish() // 5

    pubsub1.unsubscribe('event-unsubscribe-1')
    // pubsub1 cancels all subscriptions of pubsub2
    pubsub1.unsubscribe('event-unsubscribe-2')

    setTimeout(() => {
      expect(count).toBe(5)
      expect(usePubsub.observes).toEqual({})
      done()
    })
  })

  it('setup unmount unsubscribe', () => {
    const vm = useSetup(() => {
      const { subscribe } = usePubsub('setup-unmount')
      subscribe(() => {})
      subscribe(() => {})
      subscribe(() => {})
      subscribe(() => {})
      subscribe(() => {})
      onUnmounted(() => {
        expect(usePubsub.observes).toEqual({})
      })
    })
    vm.unmount()
  })
})
