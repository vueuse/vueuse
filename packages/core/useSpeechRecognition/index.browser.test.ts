import { describe, expect, it } from 'vitest'
import { useSpeechRecognition } from './index'

function createMockWindow() {
  const handlers: Record<string, ((ev: any) => any) | null> = {}
  class MockSpeechRecognition {
    continuous = false
    interimResults = false
    lang = ''
    maxAlternatives = 1

    set onresult(fn: ((ev: any) => any) | null) {
      handlers.onresult = fn
    }

    get onresult() {
      return handlers.onresult ?? null
    }

    onstart: ((ev: any) => any) | null = null
    onerror: ((ev: any) => any) | null = null
    onend: ((ev: any) => any) | null = null

    start() {}
    stop() {}
    abort() {}
  }
  return {
    window: { SpeechRecognition: MockSpeechRecognition } as unknown as Window & typeof globalThis,
    handlers,
  }
}

describe('useSpeechRecognition', () => {
  it('should be defined', () => {
    expect(useSpeechRecognition).toBeDefined()
  })

  it('should expose confidence with default 0', () => {
    const { window } = createMockWindow()
    const { confidence } = useSpeechRecognition({ window })
    expect(confidence.value).toBe(0)
  })

  it('should update confidence from result event', () => {
    const { window, handlers } = createMockWindow()
    const { confidence, result } = useSpeechRecognition({ window })

    handlers.onresult!({
      resultIndex: 0,
      results: [
        Object.assign(
          [{ transcript: 'hello world', confidence: 0.85 }],
          { isFinal: true },
        ),
      ],
    })

    expect(result.value).toBe('hello world')
    expect(confidence.value).toBe(0.85)
  })

  it('should preserve existing return shape when window is unavailable', () => {
    const result = useSpeechRecognition({ window: null as unknown as undefined })
    expect(result.confidence.value).toBe(0)
    expect(result.result.value).toBe('')
    expect(result.isListening.value).toBe(false)
  })
})
