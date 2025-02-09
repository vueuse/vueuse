import { describe, expect, it, vi } from 'vitest'
import { useLeaderElection } from '.'

describe('useLeaderElection', () => {
  it('should be defined', () => {
    expect(useLeaderElection).toBeDefined()
  })

  it('should be doing work', () => {
    const { asLeader } = useLeaderElection({ name: 'vitest-use-once-in-all-tabs' })

    const fn = vi.fn()
    asLeader(fn)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should not be supported', () => {
    const { isSupported } = useLeaderElection({ name: 'vitest-use-once-in-all-tabs' })
    expect(isSupported.value).toBe(false)
  })
})
