import { describe, expect, it } from 'vitest'
import { useMediaSession } from './index'

describe('useMediaSession', () => {
  it('should be defined', () => {
    expect(useMediaSession).toBeDefined()
  })

  it.todo('should not update anything if not supported')

  it.todo('should update MediaSession `metadata` on states update')

  it.todo('should update MediaSession `playbackState` on states update')

  it.todo('should call `setPositionState` on states update')

  it.todo('should update `actionHandlers` on states update by calling it twice (Cancel and Re-register)')

  it.todo('should not set camera active if not supported')

  it.todo('should not set microphone active if not supported')

  it.todo('should be reset when unmounted') // useSetup
})
