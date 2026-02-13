import { describe, expect, it } from 'vitest'
import { useDocumentVisibility } from './index'

describe('useDocumentVisibility', () => {
  it('get the deafult value of document.visibilityState', () => {
    const visibility = useDocumentVisibility()
    expect(visibility.value).toBe('visible')
  })

  it('listens to visibilitychange event', () => {
    const visibility = useDocumentVisibility()

    Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true })
    document.dispatchEvent(new Event('visibilitychange'))

    expect(visibility.value).toBe('hidden')

    Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true })
    document.dispatchEvent(new Event('visibilitychange'))

    expect(visibility.value).toBe('visible')
  })
})
