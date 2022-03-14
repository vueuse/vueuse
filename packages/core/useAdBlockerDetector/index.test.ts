import { useAdBlockerDetector } from '@vueuse/core'
import { vitest } from 'vitest'

describe('useAdBlockerDetector', () => {
  it('should be defined', () => {
    expect(useAdBlockerDetector).toBeDefined()
  })

  it('should not detect any ad blocker', async() => {
    const hasBlockerDetector = await useAdBlockerDetector()

    expect(hasBlockerDetector.value).toBe(false)
  })

  it.only('should not detect any ad blocker', async() => {
    vitest.spyOn(window, 'fetch').mockImplementation(() => { throw Error })
    const hasBlockerDetector = await useAdBlockerDetector()

    expect(hasBlockerDetector.value).toBe(true)
  })
})
