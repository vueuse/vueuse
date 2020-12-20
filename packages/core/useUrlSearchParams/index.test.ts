import { useUrlSearchParams } from '.'
import { renderHook } from '../../_tests'
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
    it('update params on popstate event', () => {
      const instance = renderHook(() => {
        const params = useUrlSearchParams(mode)
        return {
          params,
        }
      }).vm

      expect(instance.params.get('foo')).toBe(null)
      mockPopstate('?foo=bar', '')
      expect(instance.params.get('foo')).toBe('bar')
    })

    it('update browser location on params change', () => {
      const instance = renderHook(() => {
        const params = useUrlSearchParams(mode)
        return {
          params,
        }
      }).vm

      expect(instance.params.get('foo')).toBe(null)
      instance.params.set('foo', 'bar')
      expect(instance.params.get('foo')).toBe('bar')
    })
  })
})
