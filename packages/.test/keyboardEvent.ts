interface dispatchKeyboardEventOptions extends Partial<KeyboardEvent> {
  key: string
  target?: HTMLElement
  eventType?: 'keydown' | 'keyup'
}

/**
 * Dispatch keyboard event
 */
export function dispatchKeyboardEvent(options: dispatchKeyboardEventOptions): void {
  const { eventType = 'keydown', target = document, key, ...args } = options
  target.dispatchEvent(new KeyboardEvent(eventType, { key, ...args }))
}
