import type { ConfigurableDocument } from '../_configurable'
import { defaultDocument } from '../_configurable'

export interface UseLiveAnnouncerOptions extends ConfigurableDocument {
  /**
   * The default politeness level for announcements
   *
   * @default 'polite'
   */
  defaultPoliteness?: 'polite' | 'assertive'

  /**
   * Default timeout in milliseconds to clear the announcement
   * This helps screen readers announce the message properly
   *
   * @default 150
   */
  defaultTimeout?: number
}

export interface UseLiveAnnouncerReturn {
  /**
   * Announce a message to screen reader users
   *
   * @param message - The message to announce
   * @param politeness - 'polite' (default) or 'assertive'
   * @param timeout - Time in ms before clearing the live region
   */
  announce: (message: string, politeness?: 'polite' | 'assertive', timeout?: number) => void

  /**
   * Announce a message with polite politeness level
   * Use for non-critical updates that don't need immediate attention
   *
   * @param message - The message to announce
   * @param timeout - Time in ms before clearing the live region
   */
  polite: (message: string, timeout?: number) => void

  /**
   * Announce a message with assertive politeness level
   * Use for critical updates that need immediate attention
   *
   * @param message - The message to announce
   * @param timeout - Time in ms before clearing the live region
   */
  assertive: (message: string, timeout?: number) => void

  /**
   * Clear any current announcement
   */
  clear: () => void
}

const LIVE_REGION_ID = 'vueuse-live-announcer'

/**
 * Provides a way to announce messages to screen reader users using ARIA live regions.
 *
 * This composable creates a hidden live region in the DOM that can be used to announce
 * dynamic content changes to screen reader users. It follows ARIA best practices for
 * live regions and works across different browsers and screen readers.
 *
 * @see https://vueuse.org/useLiveAnnouncer
 * @see https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions
 * @param options - Configuration options
 */
export function useLiveAnnouncer(options: UseLiveAnnouncerOptions = {}): UseLiveAnnouncerReturn {
  const {
    document = defaultDocument,
    defaultPoliteness = 'polite',
    defaultTimeout = 150,
  } = options

  /**
   * Create or get the live region element
   */
  function getLiveRegion(): HTMLElement | null {
    if (!document)
      return null

    // Try to find existing live region
    let liveRegion = document.getElementById(LIVE_REGION_ID) as HTMLElement | null

    if (!liveRegion) {
      // Create new live region
      liveRegion = document.createElement('div')
      liveRegion.id = LIVE_REGION_ID
      liveRegion.setAttribute('role', 'status')
      liveRegion.setAttribute('aria-live', 'polite')
      liveRegion.setAttribute('aria-atomic', 'true')

      // Hide visually but keep accessible to screen readers
      liveRegion.style.cssText = `
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      `

      document.body.appendChild(liveRegion)
    }

    return liveRegion
  }

  /**
   * Announce a message to screen reader users
   */
  function announce(
    message: string,
    politeness: 'polite' | 'assertive' = defaultPoliteness,
    timeout: number = defaultTimeout,
  ): void {
    const region = getLiveRegion()
    if (!region)
      return

    // Set the politeness level
    region.setAttribute('aria-live', politeness)

    // Clear previous content
    region.textContent = ''

    // Use setTimeout to ensure the screen reader picks up the change
    // This is a common pattern for reliable announcements
    setTimeout(() => {
      region.textContent = message

      // Clear after timeout to prepare for next announcement
      if (timeout > 0) {
        setTimeout(() => {
          region.textContent = ''
        }, timeout)
      }
    }, 50)
  }

  /**
   * Announce with polite politeness
   */
  function polite(message: string, timeout?: number): void {
    announce(message, 'polite', timeout ?? defaultTimeout)
  }

  /**
   * Announce with assertive politeness
   */
  function assertive(message: string, timeout?: number): void {
    announce(message, 'assertive', timeout ?? defaultTimeout)
  }

  /**
   * Clear the current announcement
   */
  function clear(): void {
    const region = getLiveRegion()
    if (region) {
      region.textContent = ''
    }
  }

  return {
    announce,
    polite,
    assertive,
    clear,
  }
}
