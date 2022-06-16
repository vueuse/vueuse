import { BehaviorSubject, Subject } from 'rxjs'
import { first, skip } from 'rxjs/operators'
import { useInjectedSetup } from '../../.test'
import { useSubject } from '.'

describe('useSubject', () => {
  it('should be defined', () => {
    expect(useSubject).toBeDefined()
  })

  it('should be ref', () => {
    const subject = new Subject<boolean>()

    useInjectedSetup(() => {
      const subjectRef = useSubject(subject)

      expect(subjectRef.value).toBe(undefined)
      subject.next(true)
      expect(subjectRef.value).toBe(true)
    })
  })

  it('should get value immediately from BehaviorSubject', () => {
    const subject = new BehaviorSubject(false)

    useInjectedSetup(() => {
      const subjectRef = useSubject(subject)

      expect(subjectRef.value).toBe(false)
      subject.next(true)
      expect(subjectRef.value).toBe(true)
    })
  })

  it('should propagate value change to Subject', async () => {
    const subject = new BehaviorSubject(false)

    const value = await new Promise((resolve) => {
      subject.pipe(skip(1), first()).subscribe(resolve)

      const subjectRef = useSubject(subject)

      subjectRef.value = true
    })

    expect(value).toBe(true)
    expect(subject.value).toBe(true)
  })
})
