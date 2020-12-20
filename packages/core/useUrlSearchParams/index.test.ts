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
    test('update params on popstate event', () => {
      useSetup(() => {
        const params = useUrlSearchParams(mode)
        expect(params.value.get('foo')).toBe(null)
        if (mode === 'hash')
          mockPopstate('', '#/test/?foo=bar')
        else
          mockPopstate('?foo=bar', '')

        expect(params.value.get('foo')).toBe('bar')
      })
    })

    it('update browser location on params change', () => {
      useSetup(() => {
        const params = useUrlSearchParams(mode)
        expect(params.value.get('foo')).toBe(null)
        params.value.set('foo', 'bar')
        expect(params.value.get('foo')).toBe('bar')
      })
    })
  })
})
