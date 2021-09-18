import { useSetup } from '../../.test'
import { useRandomString } from '.'

describe('useRandomString', () => {
  it('should be defined', () => {
    expect(useRandomString).toBeDefined()
  })

  it('should generate a random string with default params', () => {
    useSetup(() => {
      const { randomString } = useRandomString()

      expect(randomString.value.length).toBe(10)
      expect(typeof randomString.value).toBe('string')
    })
  })

  it('should generate a random string with params specified', () => {
    useSetup(() => {
      const { randomString } = useRandomString({ prefix: 'vueisgreat', charLength: 15 })

      expect(randomString.value.length).toBe(25)
      expect(typeof randomString.value).toBe('string')

      // It includes the prefix
      expect(randomString.value).toContain('vueisgreat')
    })
  })

  it('can generate with re-generate with supplied function', () => {
    useSetup(() => {
      const { randomString, generateRandomString } = useRandomString()

      expect(randomString.value.length).toBe(10)
      expect(typeof randomString.value).toBe('string')

      randomString.value = generateRandomString()

      // It includes the prefix
      expect(randomString.value.length).toBe(10)
      expect(typeof randomString.value).toBe('string')
    })
  })
})
