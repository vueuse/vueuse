import { renderHook } from '../../_tests'
import { useNProgress } from './index'

describe('useNProgress', () => {
  it('should be defined', () => {
    expect(useNProgress).toBeDefined()
  })

  it('should start state as false', () => {
    renderHook(() => {
      const { isLoading } = useNProgress()

      expect(isLoading.value).toBeFalsy()
    })
  })
})
