import { useUrlSearchParams } from '.'
import { useSetup } from '../../_tests'
import each from 'jest-each'

describe('useUrlSearchParams', () => {
  const baseURL = 'https://vueuse.js.org'

  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      value: new URL(baseURL),
      writable: true,
    })
    window.location.search = ''
    window.location.hash = ''
  })

  const mockPopstate = (search: string, hash: string) => {
    window.location.search = search
    window.location.hash = hash
    window.dispatchEvent(new PopStateEvent('popstate', {
      state: {
        ...location,
        search,
        hash,
      },
    }))
  }

  each([
    'history',
    'hash',
  ]).describe('each mode', (mode: 'history' | 'hash') => {
    test('update params on poststate event', () => {
      useSetup(() => {
        const params = useUrlSearchParams(mode)
        expect(params.foo).toBeUndefined()
        if (mode === 'hash')
          mockPopstate('', '#/test/?foo=bar')
        else
          mockPopstate('?foo=bar', '')

        expect(params.foo).toBe('bar')
      })
    })

    test('update browser location on params change', () => {
      useSetup(() => {
        const params = useUrlSearchParams(mode)
        expect(params.foo).toBeUndefined()
        params.foo = 'bar'

        expect(params.foo).toBe('bar')
      })
    })

    test('array url search param', () => {
      useSetup(() => {
        const params = useUrlSearchParams(mode)
        expect(params.foo).toBeUndefined()
        params.foo = ['bar1', 'bar2']

        expect(params.foo).toEqual(['bar1', 'bar2'])
      })
    })
  })
})
