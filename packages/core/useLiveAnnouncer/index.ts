import type { ConfigurableWindow } from '../_configurable'
import { nextTick } from 'vue'
import { defaultWindow } from '../_configurable'

export interface UseLiveAnnouncerOptions extends ConfigurableWindow {
  /**
   * The prefix for the id of the announcer elements.
   * @default 'vueuse-live-announcer'
   */
  idPrefix?: string
}

export interface UseLiveAnnouncerReturn {
  announce: (message: string, mode?: 'polite' | 'assertive', timeout?: number) => void
  polite: (message: string, timeout?: number) => void
  assertive: (message: string, timeout?: number) => void
}

export function useLiveAnnouncer(options: UseLiveAnnouncerOptions = {}): UseLiveAnnouncerReturn {
  const {
    idPrefix = 'vueuse-live-announcer',
    window = defaultWindow,
  } = options

  const document = window?.document

  function ensureAnnouncer() {
    if (!document)
      return

    let container = document.getElementById(`${idPrefix}-container`)

    if (!container) {
      container = document.createElement('div')
      container.id = `${idPrefix}-container`
      container.style.position = 'absolute'
      container.style.width = '1px'
      container.style.height = '1px'
      container.style.padding = '0'
      container.style.margin = '-1px'
      container.style.overflow = 'hidden'
      container.style.clip = 'rect(0, 0, 0, 0)'
      container.style.whiteSpace = 'nowrap'
      container.style.border = '0'
      container.style.wordWrap = 'normal'
      container.style.clipPath = 'inset(50%)'
      document.body.appendChild(container)
    }

    if (!document.getElementById(`${idPrefix}-polite`)) {
      const polite = document.createElement('div')
      polite.id = `${idPrefix}-polite`
      polite.setAttribute('role', 'status')
      polite.setAttribute('aria-live', 'polite')
      polite.setAttribute('aria-atomic', 'true')
      container.appendChild(polite)
    }

    if (!document.getElementById(`${idPrefix}-assertive`)) {
      const assertive = document.createElement('div')
      assertive.id = `${idPrefix}-assertive`
      assertive.setAttribute('role', 'alert')
      assertive.setAttribute('aria-live', 'assertive')
      assertive.setAttribute('aria-atomic', 'true')
      container.appendChild(assertive)
    }
  }

  ensureAnnouncer()

  function announce(message: string, mode: 'polite' | 'assertive' = 'polite', timeout?: number) {
    if (!document)
      return

    ensureAnnouncer()

    const element = document.getElementById(`${idPrefix}-${mode}`)

    if (element) {
      element.textContent = ''
      nextTick(() => element.textContent = message)

      if (timeout && timeout > 0) {
        setTimeout(() => {
          if (element.textContent === message)
            element.textContent = ''
        }, timeout)
      }
    }
  }

  function polite(message: string, timeout?: number) {
    announce(message, 'polite', timeout)
  }

  function assertive(message: string, timeout?: number) {
    announce(message, 'assertive', timeout)
  }

  return {
    announce,
    polite,
    assertive,
  }
}
