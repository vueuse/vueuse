import { useSetup } from '../../.test'
import { autoResetRef } from '.'

describe('autoResetRef', () => {
  it('should be defined', () => {
    expect(autoResetRef).toBeDefined()
  })

  it('should be default at first', () => {
    useSetup(() => {
      const val = autoResetRef('default', 100)
      expect(val.value).toBe('default')
    })
  })

  it('should be updated', () => {
    useSetup(() => {
      const val = autoResetRef('default', 100)

      val.value = 'update'
      expect(val.value).toBe('update')
    })
  })

  it('should be reset', () => {
    useSetup(async() => {
      const val = autoResetRef('default', 100)
      val.value = 'update'

      await new Promise(resolve => setTimeout(resolve, 100 + 1))

      expect(val.value).toBe('default')
    })
  })
})
