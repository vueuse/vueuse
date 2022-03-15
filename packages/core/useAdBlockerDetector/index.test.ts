import { useAdBlockerDetector } from '@vueuse/core'
import { vitest } from 'vitest'

describe('useAdBlockerDetector', () => {
  it('should be defined', () => {
    expect(useAdBlockerDetector).toBeDefined()
  })

  it('should not detect any ad blocker', async() => {
    vitest.spyOn(window, 'fetch').mockImplementationOnce(() => Promise.resolve({} as Response))
    const hasBlockerDetector = await useAdBlockerDetector()

    expect(hasBlockerDetector.value).toBe(false)
  })

  it('should detect an ad blocker', async() => {
    vitest.spyOn(window, 'fetch').mockImplementationOnce(() => { throw Error })
    const hasBlockerDetector = await useAdBlockerDetector()

    expect(hasBlockerDetector.value).toBe(true)
  })
})
