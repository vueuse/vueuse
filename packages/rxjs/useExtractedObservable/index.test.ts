import { describe, expect, it, vi } from 'vitest'
import { BehaviorSubject, Subject, of } from 'rxjs'
import { nextTick, reactive, ref } from 'vue-demi'
import { delay, endWith, tap } from 'rxjs/operators'
import { useExtractedObservable } from './index'

const waitFor = (delay: number) => new Promise(resolve => setTimeout(resolve, delay))

describe('useExtractedObservable', () => {
  describe('when no options are provided', () => {
    it('should call the extractor immediately', () => {
      const obs = new Subject<number>()

      const last = ref(42)

      const extractor = vi.fn((lastValue: number) => obs.pipe(endWith(lastValue)))

      /* const refObs = */ useExtractedObservable(last, extractor)

      expect(extractor).toHaveBeenCalledOnce()
      expect(extractor.mock.lastCall![0]).toStrictEqual(last.value)
    })
  })

  describe('when initialValue is not provided', () => {
    it('should have undefined as a value until the observable emits a value', async () => {
      expect.hasAssertions()
      const obs = new Subject<number>()

      const last = ref(42)

      const refObs = useExtractedObservable(last, lastValue => obs.pipe(endWith(lastValue)))

      expect(refObs.value).toBeUndefined()

      obs.next(23)

      await nextTick()

      expect(refObs.value).toStrictEqual(23)
    })
  })

  describe('when initialValue is provided', () => {
    it('should have initialValue as a value until the observable emits a value', async () => {
      expect.hasAssertions()
      const obs = new Subject<number>()

      const last = ref(42)

      const refObs = useExtractedObservable(last, lastValue => obs.pipe(endWith(lastValue)), {
        initialValue: 13,
      })

      expect(refObs.value).toStrictEqual(13)

      obs.next(23)

      await nextTick()

      expect(refObs.value).toStrictEqual(23)
    })

    it('should hold the first emitted value if the observable emits values immediately on subscription', async () => {
      expect.hasAssertions()
      const obs = new BehaviorSubject(16)

      const last = ref(42)

      const refObs = useExtractedObservable(last, () => obs, {
        initialValue: 13,
      })

      expect(refObs.value).toStrictEqual(16)
    })
  })

  describe('when onError is provided', () => {
    it('calls onError when an observable emits an error', async () => {
      expect.hasAssertions()
      const re = ref(0)
      const error = new Error('Odd number')

      const extractor = (num: number) => of(num).pipe(
        tap((n: number) => {
          if (n % 2 === 1)
            throw error
        }),
      )
      const onError = vi.fn()

      const refObs = useExtractedObservable(re, extractor, {
        onError,
      })

      expect(onError).not.toHaveBeenCalled()
      expect(refObs.value).toStrictEqual(re.value)

      re.value = 1

      await nextTick()

      expect(onError).toHaveBeenCalledOnce()
      expect(onError).toHaveBeenCalledWith(error)
    })

    it('doesn\'t call onError when the observable doesn\'t emit an error', async () => {
      expect.hasAssertions()

      const re = ref([1, 2])
      const onError = vi.fn()

      /* const obsRef = */ useExtractedObservable(re, (arr: unknown[]) => of(...arr), {
        onError,
      })

      expect(onError).not.toHaveBeenCalled()

      re.value = [42]

      await nextTick()

      expect(onError).not.toHaveBeenCalled()
    })
  })

  describe('when onComplete is provided', () => {
    it('calls onComplete when an observable completes', async () => {
      expect.hasAssertions()

      const re = ref()
      const extractor = (args: unknown[]) => of(...args)
      const onComplete = vi.fn()

      const obsRef = useExtractedObservable(re, extractor, {
        onComplete,
      }, {
        immediate: false,
      })

      expect(onComplete).not.toHaveBeenCalled()

      re.value = [19, 42]

      await nextTick()
      await nextTick()

      expect(onComplete).toHaveBeenCalledOnce()
      expect(obsRef.value).toStrictEqual(42)
    })

    it('doesn\'t call onComplete if the watched observable has changed before it could complete', async () => {
      expect.hasAssertions()

      const re = ref([13, 23, 420])
      const extractor = (arr: unknown[]) => of(...arr).pipe(
        delay(1000),
      )
      const onComplete = vi.fn()

      const obsRef = useExtractedObservable(re, extractor, {
        onComplete,
      })

      setTimeout(() => {
        re.value = [42]
      }, 500)

      await waitFor(6000)

      expect(onComplete).toHaveBeenCalledOnce()
      expect(obsRef.value).toStrictEqual(42)
    }, 9000)
  })

  it('properly uses an array of watch sources', async () => {
    const obj = reactive({
      xyz: 'abc',
    })

    const re = ref('def')

    const extractor = ([abc, def]: [string, string]) => of(`${abc}${def}`)

    const obsRef = useExtractedObservable([() => obj.xyz, re], extractor)

    expect(obsRef.value).toStrictEqual('abcdef')

    re.value = 'abc'

    await nextTick()

    expect(obsRef.value).toStrictEqual('abcabc')

    obj.xyz = 'xyz'

    await nextTick()

    expect(obsRef.value).toStrictEqual('xyzabc')
  })

  it('properly uses an object of watch sources', async () => {
    expect.hasAssertions()

    const obj = reactive({
      x: 0,
      y: 0,
      z: 0,
    })

    const extractor = (source: typeof obj) => of(`x: ${source.x}, y: ${source.y}, z: ${source.z}`)

    const obsRef = useExtractedObservable(obj, extractor)

    expect(obsRef.value).toStrictEqual('x: 0, y: 0, z: 0')

    obj.x = 42

    await nextTick()

    expect(obsRef.value).toStrictEqual('x: 42, y: 0, z: 0')

    obj.x = 0
    obj.y = 1

    await nextTick()

    expect(obsRef.value).toStrictEqual('x: 0, y: 1, z: 0')

    obj.x = 1
    obj.y = 0
    obj.z = 1

    await nextTick()

    expect(obsRef.value).toStrictEqual('x: 1, y: 0, z: 1')
  })

  it('properly uses a function as a watch source', async () => {
    expect.hasAssertions()

    const obj = reactive({
      stuff: 'xyz',
    })

    const obsRef = useExtractedObservable(() => obj.stuff, val => of(`pre-${val}`))

    expect(obsRef.value).toStrictEqual(`pre-${obj.stuff}`)

    obj.stuff = 'test'

    await nextTick()

    expect(obsRef.value).toStrictEqual(`pre-${obj.stuff}`)
  })
})
