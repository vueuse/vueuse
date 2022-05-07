import type { Observable } from 'rxjs'
import { BehaviorSubject } from 'rxjs'
import { delay } from 'rxjs/operators'
import { useObservable } from '.'

describe('useObservable', () => {
  let testDataSource: BehaviorSubject<TestPerson>
  let delayedEmissionStream: Observable<TestPerson>

  beforeEach(() => {
    testDataSource = new BehaviorSubject<TestPerson>({ fullName: 'Mario Mario' })
    delayedEmissionStream = testDataSource.pipe(delay(0))
  })

  describe('when initialValue is not provided', () => {
    it('should set the ref\'s value to undefined before the stream has emitted', async () => {
      const testPerson = useObservable(delayedEmissionStream)
      expect(testPerson.value).toBe(undefined)
    })

    it('should set the ref\'s value from the data emitted on the stream', async () => {
      const testPerson = useObservable(delayedEmissionStream)

      // wait for next tick, allowing RxJS to emit the value
      await new Promise(resolve => setTimeout(resolve, 0))

      // Notice optional chaining operator required
      expect(testPerson.value?.fullName).toEqual('Mario Mario')
    })
  })

  describe('when initialValue is provided', () => {
    it('should set the ref\'s value to initialData before the stream has emitted', () => {
      const testPerson = useObservable(delayedEmissionStream, { initialValue: { fullName: 'I don\'t know yet!' } })

      // Notice how we do not need the optional chaining to access fullName
      expect(testPerson.value.fullName).toBe('I don\'t know yet!')
    })

    it('should set the ref\'s value from the data emitted on the stream', async () => {
      const testPerson = useObservable(delayedEmissionStream, { initialValue: { fullName: 'I don\'t know yet!' } })
      // wait for next tick, allowing RxJS to emit the value
      await new Promise(resolve => setTimeout(resolve, 0))

      // Notice how we do not need the optional chaining to access fullName
      expect(testPerson.value.fullName).toBe('Mario Mario')
    })
  })
})

/**
 * Used for this test to examine optional chaining and typescript type computation.
 */
interface TestPerson {
  fullName: string
}
