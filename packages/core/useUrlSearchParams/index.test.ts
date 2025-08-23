import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { useUrlSearchParams } from './index'

describe('useUrlSearchParams', () => {
  const baseURL = 'https://vueuse.org'

  Object.defineProperty(window, 'location', {
    value: new URL(baseURL),
    writable: true,
  })

  let mockHistory: string[] = ['']
  let mockCurrentHistoryIndex = 0
  const mockReplaceState = vi.fn()
  const mockPushState = vi.fn((_state, _title, url: string) => {
    mockHistory.push(url)
    mockCurrentHistoryIndex++
  })

  beforeEach(() => {
    vi.clearAllMocks()
    mockHistory = ['']
    mockCurrentHistoryIndex = 0
    window.location.search = ''
    window.location.hash = ''
    window.history.replaceState = mockReplaceState
    window.history.pushState = mockPushState
  })

  const mockPopstate = (search: string, hash: string) => {
    window.location.search = search
    window.location.hash = hash
    window.dispatchEvent(new PopStateEvent('popstate', {
      state: {
        ...window.location,
        search,
        hash,
      },
    }))
  }

  const mockBack = async (search: string, hash: string) => {
    window.location.search = search
    window.location.hash = hash
    window.dispatchEvent(new PopStateEvent('popstate', {
      state: {
        ...window.location,
        search,
        hash,
      },
    }))

    await nextTick()
    mockHistory.pop()
    mockCurrentHistoryIndex -= 2
  }

  const mockForward = async (search: string, hash: string) => {
    window.location.search = search
    window.location.hash = hash
    window.dispatchEvent(new PopStateEvent('popstate', {
      state: {
        ...window.location,
        search,
        hash,
      },
    }))

    await nextTick()
    mockHistory.pop()
  }

  ([
    'history',
    'hash',
    'hash-params',
  ] as const).forEach((mode) => {
    describe(`${mode} mode`, () => {
      it('return initial params', async () => {
        if (mode === 'hash')
          window.location.hash = '#/test/?foo=bar'
        else if (mode === 'hash-params')
          window.location.hash = '#foo=bar'
        else
          window.location.search = '?foo=bar'

        const params = useUrlSearchParams(mode)

        await nextTick()
        expect(params.foo).toBe('bar')
      })

      it('return initialValue', async () => {
        const initialValue = { foo: 'bar' }
        const params1 = useUrlSearchParams(mode, { initialValue })
        // @ts-expect-error test window=null
        const params2 = useUrlSearchParams(mode, { initialValue, window: null })

        expect(params1.foo).toBe('bar')
        expect(params2.foo).toBe('bar')
      })

      it('update params on poststate event', async () => {
        const params = useUrlSearchParams(mode)
        expect(params.foo).toBeUndefined()

        switch (mode) {
          case 'hash':
            mockPopstate('', '#/test/?foo=bar')
            break
          case 'hash-params':
            mockPopstate('', '#foo=bar')
            break
          case 'history':
            mockPopstate('?foo=bar', '')
        }
        await nextTick()
        expect(params.foo).toBe('bar')

        switch (mode) {
          case 'hash':
            mockPopstate('', '#/test/?foo=bar1&foo=bar2')
            break
          case 'hash-params':
            mockPopstate('', '#foo=bar1&foo=bar2')
            break
          case 'history':
            mockPopstate('?foo=bar1&foo=bar2', '')
        }
        await nextTick()
        expect(params.foo).toEqual(['bar1', 'bar2'])

        switch (mode) {
          case 'hash':
            mockPopstate('', '#/test/?foo=')
            break
          case 'hash-params':
            mockPopstate('', '#foo=')
            break
          case 'history':
            mockPopstate('?foo=', '')
        }
        await nextTick()
        expect(params.foo).toBe('')
      })

      it('stop poststate event', async () => {
        const params = useUrlSearchParams(mode, { write: false })
        expect(params.foo).toBeUndefined()

        switch (mode) {
          case 'hash':
            mockPopstate('', '#/test/?foo=bar')
            break
          case 'hash-params':
            mockPopstate('', '#foo=bar')
            break
          case 'history':
            mockPopstate('?foo=bar', '')
        }
        await nextTick()
        expect(params.foo).toBeUndefined()
      })

      it('update browser location on params change', async () => {
        const params = useUrlSearchParams(mode)

        params.foo = 'bar'
        await nextTick()
        switch (mode) {
          case 'history':
            expect(window.history.replaceState).toBeCalledWith(null, '', '/?foo=bar')
            break
          case 'hash':
            expect(window.history.replaceState).toBeCalledWith(null, '', '/#?foo=bar')
            break
          case 'hash-params':
            expect(window.history.replaceState).toBeCalledWith(null, '', '/#foo=bar')
            break
        }

        if (mode === 'hash')
          window.location.hash = '#?foo=bar'

        delete params.foo
        await nextTick()
        switch (mode) {
          case 'history':
            expect(window.history.replaceState).toBeCalledWith(null, '', '/')
            break
          case 'hash':
            expect(window.history.replaceState).toBeCalledWith(null, '', '/#')
            break
          case 'hash-params':
            expect(window.history.replaceState).toBeCalledWith(null, '', '/')
            break
        }
      })

      it('array url search param', async () => {
        const params = useUrlSearchParams(mode)
        expect(params.foo).toBeUndefined()
        params.foo = ['bar1', 'bar2']

        await nextTick()
        switch (mode) {
          case 'history':
            expect(window.history.replaceState).toBeCalledWith(null, '', '/?foo=bar1&foo=bar2')
            break
          case 'hash':
            expect(window.history.replaceState).toBeCalledWith(null, '', '/#?foo=bar1&foo=bar2')
            break
          case 'hash-params':
            expect(window.history.replaceState).toBeCalledWith(null, '', '/#foo=bar1&foo=bar2')
            break
        }
      })

      it('changes write mode', async () => {
        const params = useUrlSearchParams(mode, { writeMode: 'push' })

        params.foo = 'bar'
        await nextTick()
        switch (mode) {
          case 'history':
            expect(window.history.pushState).toBeCalledWith(null, '', '/?foo=bar')
            expect(window.history.replaceState).not.toBeCalled()
            break
          case 'hash':
            expect(window.history.pushState).toBeCalledWith(null, '', '/#?foo=bar')
            expect(window.history.replaceState).not.toBeCalled()
            break
          case 'hash-params':
            expect(window.history.pushState).toBeCalledWith(null, '', '/#foo=bar')
            expect(window.history.replaceState).not.toBeCalled()
            break
        }
      })

      it('generic url search params', () => {
        interface CustomUrlParams extends Record<string, any> {
          customFoo: number | undefined
        }

        const params = useUrlSearchParams<CustomUrlParams>(mode)
        expect(params.customFoo).toBeUndefined()

        params.customFoo = 42

        expect(params.customFoo).toEqual(42)
      })

      it('should remove null & falsy', async () => {
        const params = useUrlSearchParams(mode, {
          removeNullishValues: true,
          removeFalsyValues: true,
          initialValue: {
            foo: 'bar',
            bar: 'foo',
          } as { foo: string | null, bar: string | boolean },
        })
        params.foo = null
        params.bar = false
        await nextTick()
        expect(params).toEqual({ foo: null, bar: false })
      })

      it('strips equal sign for empty params use customer stringify function', async () => {
        const params = useUrlSearchParams(mode, { stringify: params => params.toString().replace(/=(&|$)/g, '$1') })
        params.foo = ''
        params.bar = ''
        await nextTick()
        switch (mode) {
          case 'history':
            expect(window.history.replaceState).toBeCalledWith(null, '', '/?foo&bar')
            break
          case 'hash':
            expect(window.history.replaceState).toBeCalledWith(null, '', '/#?foo&bar')
            break
          case 'hash-params':
            expect(window.history.replaceState).toBeCalledWith(null, '', '/#foo&bar')
            break
        }
      })

      it('should push history state when value is updated', async () => {
        const params = useUrlSearchParams(mode, { writeMode: 'push' })
        expect(params.foo).toBeUndefined()
        expect(params.bar).toBeUndefined()

        params.foo = 'first'
        await nextTick()
        params.bar = 'second'
        await nextTick()
        switch (mode) {
          case 'history':
            expect(mockHistory).toEqual(['', '/?foo=first', '/?foo=first&bar=second'])
            expect(mockCurrentHistoryIndex).toBe(2)
            break
          case 'hash':
            expect(mockHistory).toEqual(['', '/#?foo=first', '/#?foo=first&bar=second'])
            expect(mockCurrentHistoryIndex).toBe(2)
            break
          case 'hash-params':
            expect(mockHistory).toEqual(['', '/#foo=first', '/#foo=first&bar=second'])
            expect(mockCurrentHistoryIndex).toBe(2)
            break
        }

        switch (mode) {
          case 'hash':
            mockBack('', '#/test/?foo=first')
            break
          case 'hash-params':
            mockBack('', '#foo=first')
            break
          case 'history':
            mockBack('?foo=first', '')
        }
        await nextTick()
        switch (mode) {
          case 'history':
            expect(mockHistory).toEqual(['', '/?foo=first', '/?foo=first&bar=second'])
            expect(mockCurrentHistoryIndex).toBe(1)
            expect(params.foo).toBe('first')
            expect(params.bar).toBeUndefined()
            break
          case 'hash':
            expect(mockHistory).toEqual(['', '/#?foo=first', '/#?foo=first&bar=second'])
            expect(mockCurrentHistoryIndex).toBe(1)
            expect(params.foo).toBe('first')
            expect(params.bar).toBeUndefined()
            break
          case 'hash-params':
            expect(mockHistory).toEqual(['', '/#foo=first', '/#foo=first&bar=second'])
            expect(mockCurrentHistoryIndex).toBe(1)
            expect(params.foo).toBe('first')
            expect(params.bar).toBeUndefined()
            break
        }

        switch (mode) {
          case 'hash':
            mockForward('', '#/test/?foo=first&bar=second')
            break
          case 'hash-params':
            mockForward('', '#foo=first&bar=second')
            break
          case 'history':
            mockForward('?foo=first&bar=second', '')
        }
        await nextTick()
        switch (mode) {
          case 'history':
            expect(mockHistory).toEqual(['', '/?foo=first', '/?foo=first&bar=second'])
            expect(mockCurrentHistoryIndex).toBe(2)
            expect(params.foo).toBe('first')
            expect(params.bar).toBe('second')
            break
          case 'hash':
            expect(mockHistory).toEqual(['', '/#?foo=first', '/#?foo=first&bar=second'])
            expect(mockCurrentHistoryIndex).toBe(2)
            expect(params.foo).toBe('first')
            expect(params.bar).toBe('second')
            break
          case 'hash-params':
            expect(mockHistory).toEqual(['', '/#foo=first', '/#foo=first&bar=second'])
            expect(mockCurrentHistoryIndex).toBe(2)
            expect(params.foo).toBe('first')
            expect(params.bar).toBe('second')
            break
        }
      })
    })
  })

  it('hash url without params', () => {
    window.location.hash = '#/test/'
    const params = useUrlSearchParams('hash')
    expect(params).toEqual({})

    const newHash = '#/change/?foo=bar'
    window.location.hash = newHash
    expect(window.location.hash).toBe(newHash)
  })
})
