import type { MockedFunction } from 'vitest'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ComputedRef, Ref } from 'vue-demi'
import type { Observable, Subject } from 'rxjs'
import { BehaviorSubject, of } from 'rxjs'
import { computed, nextTick, reactive, ref } from 'vue-demi'
import { delay, map, tap } from 'rxjs/operators'
import { watchExtractedObservable } from './index'

class TestWrapper {
  public readonly obs$: Subject<number>

  constructor(private num: number) {
    this.obs$ = new BehaviorSubject<number>(num)
  }

  incr() {
    this.obs$.next(++this.num)
  }
}

const waitFor = (delay: number) => new Promise(resolve => setTimeout(resolve, delay))

describe('watchExtractedObservable', () => {
  describe('when no options are provided', () => {
    let numRef: Ref<number | undefined>
    let obj: ComputedRef<TestWrapper | null>
    let extractor: MockedFunction<(wrapper: TestWrapper) => Observable<number>>
    let callback: MockedFunction<(num: number) => void>

    beforeEach(() => {
      numRef = ref<number>()
      obj = computed(() => typeof numRef.value == 'number' ? new TestWrapper(numRef.value) : null)
      extractor = vi.fn().mockImplementation((wrapper: TestWrapper) => wrapper.obs$)
      callback = vi.fn().mockImplementation((num: number) => console.log(num))
    })

    it('calls neither the extractor nor the callback if the provided ref is nullish', () => {
      const handle = watchExtractedObservable(obj, extractor, callback)

      expect(extractor).not.toHaveBeenCalled()
      expect(callback).not.toHaveBeenCalled()

      handle()
    })

    it('calls the extractor and the callback after the ref has changed', async () => {
      expect.hasAssertions()

      const handle = watchExtractedObservable(obj, extractor, callback)

      numRef.value = 0

      await nextTick()

      expect(extractor).toHaveBeenCalledOnce()

      expect(callback).toHaveBeenCalledOnce()
      expect(callback).toHaveBeenCalledWith(numRef.value)

      handle()
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
      const callback = vi.fn()
      const onError = vi.fn()

      const handle = watchExtractedObservable(re, extractor, callback, {
        onError,
      }, {
        immediate: true,
      })

      expect(callback).toHaveBeenCalledOnce()
      expect(callback).toHaveBeenCalledWith(re.value)
      expect(onError).not.toHaveBeenCalled()

      re.value = 1

      await nextTick()

      expect(onError).toHaveBeenCalledOnce()
      expect(onError).toHaveBeenCalledWith(error)
      expect(callback).toHaveBeenCalledOnce()

      handle()
    })

    it('doesn\'t call onError when the observable doesn\'t emit an error', async () => {
      expect.hasAssertions()

      const re = ref([1, 2])
      const callback = vi.fn()
      const onError = vi.fn()

      const handle = watchExtractedObservable(re, (arr: unknown[]) => of(...arr), callback, {
        onError,
      }, {
        immediate: true,
      })

      expect(onError).not.toHaveBeenCalled()
      expect(callback).toHaveBeenCalledTimes(2)
      expect(callback).toHaveBeenCalledWith(1)
      expect(callback).toHaveBeenLastCalledWith(2)

      re.value = [42]

      await nextTick()

      expect(onError).not.toHaveBeenCalled()
      expect(callback).toHaveBeenCalledTimes(3)
      expect(callback).toHaveBeenLastCalledWith(42)

      handle()
    })
  })

  describe('when onComplete is provided', () => {
    it('calls onComplete when an observable completes', async () => {
      const re = ref([1, 2])
      const extractor = (args: unknown[]) => of(...args)
      const callback = vi.fn()
      const onComplete = vi.fn()

      const handle = watchExtractedObservable(re, extractor, callback, {
        onComplete,
      })

      expect(callback).not.toHaveBeenCalled()
      expect(onComplete).not.toHaveBeenCalled()

      re.value = [1, 3, 6]

      await nextTick()

      expect(callback).toHaveBeenCalledTimes(3)
      expect(onComplete).toHaveBeenCalledOnce()

      re.value = [42]

      await nextTick()

      expect(callback).toHaveBeenCalledTimes(4)
      expect(onComplete).toHaveBeenCalledTimes(2)

      handle()
    })

    it('doesn\'t call onComplete if the watched observable has changed before it could complete', async () => {
      expect.hasAssertions()

      const re = ref([42, 23, 420])
      const extractor = (arr: unknown[]) => of(...arr).pipe(
        delay(1000),
        map(() => 42),
      )
      const onComplete = vi.fn()

      const handle = watchExtractedObservable(re, extractor, () => {}, {
        onComplete,
      }, {
        immediate: true,
      })

      setTimeout(() => {
        re.value = [42]
      }, 500)

      await waitFor(6000)

      expect(onComplete).toHaveBeenCalledOnce()

      handle()
    }, 9000)
  })

  it('properly uses an array of watch sources', () => {
    const obj = reactive({
      xyz: 'abc',
    })

    const re = ref('def')

    const extractor = ([abc, def]: [string, string]) => of([abc, def])
    const callback = vi.fn(() => {})

    const handle = watchExtractedObservable([() => obj.xyz, re], extractor, callback, {}, {
      immediate: true,
    })

    expect(callback).toHaveBeenCalledOnce()
    expect(callback).toHaveBeenCalledWith(['abc', 'def'])

    handle()
  })

  it('properly uses an object of watch sources', async () => {
    expect.hasAssertions()

    const obj = reactive({
      x: 0,
      y: 0,
      z: 0,
    })

    const extractor = (source: typeof obj) => of(`x: ${source.x}, y: ${source.y}, z: ${source.z}`)

    const callback = vi.fn(() => {})

    const handle = watchExtractedObservable(obj, extractor, callback, {}, {
      immediate: true,
    })

    expect(callback).toHaveBeenLastCalledWith('x: 0, y: 0, z: 0')

    obj.x = 42

    await nextTick()

    expect(callback).toHaveBeenLastCalledWith('x: 42, y: 0, z: 0')

    obj.x = 0
    obj.y = 1

    await nextTick()

    expect(callback).toHaveBeenLastCalledWith('x: 0, y: 1, z: 0')

    obj.x = 1
    obj.y = 0
    obj.z = 1

    await nextTick()

    expect(callback).toHaveBeenLastCalledWith('x: 1, y: 0, z: 1')

    expect(callback).toHaveBeenCalledTimes(4)

    handle()
  })

  it('properly uses a function as a watch source', async () => {
    expect.hasAssertions()

    const obj = reactive({
      stuff: 'xyz',
    })

    const callback = vi.fn(() => {})

    const handle = watchExtractedObservable(() => obj.stuff, val => of(`pre-${val}`), callback)

    expect(callback).not.toHaveBeenCalled()

    await nextTick()

    expect(callback).not.toHaveBeenCalled()

    obj.stuff = 'test'

    await nextTick()

    expect(callback).toHaveBeenCalledOnce()
    expect(callback).toHaveBeenCalledWith('pre-test')

    handle()
  })
})
