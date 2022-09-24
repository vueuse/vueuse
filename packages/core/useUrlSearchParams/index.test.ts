import { nextTick } from 'vue-demi'
import { useUrlSearchParams } from '.'

describe('useUrlSearchParams', () => {
  const baseURL = 'https://vueuse.org'

  Object.defineProperty(window, 'location', {
    value: new URL(baseURL),
    writable: true,
  })

  beforeEach(() => {
    window.location.search = ''
    window.location.hash = ''
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
        const params = useUrlSearchParams(mode, {
          initialValue: {
            foo: 'bar',
          },
        })

        expect(params.foo).toBe('bar')
      })

      test('update params on poststate event', async () => {
        const params = useUrlSearchParams(mode)
        expect(params.foo).toBeUndefined()
        if (mode === 'hash')
          mockPopstate('', '#/test/?foo=bar')
        else if (mode === 'hash-params')
          mockPopstate('', '#foo=bar')
        else
          mockPopstate('?foo=bar', '')

        await nextTick()
        expect(params.foo).toBe('bar')
      })

      test('update browser location on params change', () => {
        const params = useUrlSearchParams(mode)
        expect(params.foo).toBeUndefined()
        params.foo = 'bar'

        expect(params.foo).toBe('bar')
      })

      test('array url search param', () => {
        const params = useUrlSearchParams(mode)
        expect(params.foo).toBeUndefined()
        params.foo = ['bar1', 'bar2']

        expect(params.foo).toEqual(['bar1', 'bar2'])
      })

      test('generic url search params', () => {
        interface CustomUrlParams extends Record<string, any> {
          customFoo: number | undefined
        }

        const params = useUrlSearchParams<CustomUrlParams>(mode)
        expect(params.customFoo).toBeUndefined()

        params.customFoo = 42

        expect(params.customFoo).toEqual(42)
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
