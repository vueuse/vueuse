import { isVue3, nextTick } from 'vue-demi'
import { useUrlSearchParams } from '.'

describe('useUrlSearchParams', () => {
  const baseURL = 'https://vueuse.org'

  Object.defineProperty(window, 'location', {
    value: new URL(baseURL),
    writable: true,
  })

  const mockReplaceState = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    window.location.search = ''
    window.location.hash = ''
    window.history.replaceState = mockReplaceState
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

  ([
    'history',
    'hash',
    'hash-params',
  ] as const).forEach((mode) => {
    describe(`${mode} mode`, () => {
      test('return initial params', async () => {
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

      test('return initialValue', async () => {
        const initialValue = { foo: 'bar' }
        const params1 = useUrlSearchParams(mode, { initialValue })
        // @ts-expect-error test window=null
        const params2 = useUrlSearchParams(mode, { initialValue, window: null })

        expect(params1.foo).toBe('bar')
        expect(params2.foo).toBe('bar')
      })

      test('update params on poststate event', async () => {
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

      test('stop poststate event', async () => {
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

      if (isVue3) {
        test('update browser location on params change', async () => {
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

        test('array url search param', async () => {
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
      }

      test('generic url search params', () => {
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
          } as { foo: string | null; bar: string | boolean },
        })
        params.foo = null
        params.bar = false
        await nextTick()
        expect(params).toEqual({ foo: null, bar: false })
      })
    })
  })

  test('hash url without params', () => {
    window.location.hash = '#/test/'
    const params = useUrlSearchParams('hash')
    expect(params).toEqual({})

    const newHash = '#/change/?foo=bar'
    window.location.hash = newHash
    expect(window.location.hash).toBe(newHash)
  })
})
