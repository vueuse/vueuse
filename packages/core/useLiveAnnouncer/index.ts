import type { ShallowRef } from 'vue'
import type { ConfigurableDocument } from '../_configurable'
import { tryOnScopeDispose } from '@vueuse/shared'
import { nextTick, shallowRef } from 'vue'
import { defaultDocument } from '../_configurable'

const announcerRefCount = new Map<string, number>()

export interface UseLiveAnnouncerOptions extends ConfigurableDocument {
  /**
   * The prefix for the id of the announcer elements.
   * @default 'vueuse-live-announcer'
   */
  idPrefix?: string

  /**
   * Default timeout in milliseconds to clear the announcement.
   * Set to `0` to disable auto-clear.
   *
   * @default 7000
   */
  timeout?: number
}

export interface UseLiveAnnouncerReturn {
  /**
   * The current announcement message.
   */
  message: ShallowRef<string>

  /**
   * Announce a message to screen readers.
   *
   * @param message - The message to announce
   * @param mode - The politeness level ('polite' or 'assertive')
   * @param timeout - Timeout in milliseconds to clear the message
   */
  announce: (message: string, mode?: 'polite' | 'assertive', timeout?: number) => void

  /**
   * Announce a polite message to screen readers.
   *
   * @param message - The message to announce
   * @param timeout - Timeout in milliseconds to clear the message
   */
  polite: (message: string, timeout?: number) => void

  /**
   * Announce an assertive message to screen readers.
   *
   * @param message - The message to announce
   * @param timeout - Timeout in milliseconds to clear the message
   */
  assertive: (message: string, timeout?: number) => void
}

/**
 * Reactive ARIA live announcer for screen readers.
 *
 * @see https://vueuse.org/useLiveAnnouncer
 */
export function useLiveAnnouncer(options: UseLiveAnnouncerOptions = {}): UseLiveAnnouncerReturn {
  const {
    idPrefix = 'vueuse-live-announcer',
    document = defaultDocument,
    timeout: defaultTimeout = 7000,
  } = options

  const message = shallowRef('')

  let politeTimer: ReturnType<typeof setTimeout> | undefined
  let assertiveTimer: ReturnType<typeof setTimeout> | undefined

  if (document) {
    const count = announcerRefCount.get(idPrefix) || 0
    announcerRefCount.set(idPrefix, count + 1)
  }

  function ensureContainer() {
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
      container.style.clipPath = 'inset(50%)'
      document.body.appendChild(container)
    }

    if (!document.getElementById(`${idPrefix}-polite`)) {
      const politeEl = document.createElement('div')
      politeEl.id = `${idPrefix}-polite`
      politeEl.setAttribute('role', 'status')
      politeEl.setAttribute('aria-live', 'polite')
      politeEl.setAttribute('aria-atomic', 'true')
      container.appendChild(politeEl)
    }

    if (!document.getElementById(`${idPrefix}-assertive`)) {
      const assertiveEl = document.createElement('div')
      assertiveEl.id = `${idPrefix}-assertive`
      assertiveEl.setAttribute('role', 'alert')
      assertiveEl.setAttribute('aria-live', 'assertive')
      assertiveEl.setAttribute('aria-atomic', 'true')
      container.appendChild(assertiveEl)
    }
  }

  ensureContainer()

  function announce(msg: string, mode: 'polite' | 'assertive' = 'polite', timeout?: number) {
    if (!document)
      return

    ensureContainer()

    const element = document.getElementById(`${idPrefix}-${mode}`)
    if (!element)
      return

    // Clear previous timer for this mode
    if (mode === 'polite') {
      clearTimeout(politeTimer)
      politeTimer = undefined
    }
    else {
      clearTimeout(assertiveTimer)
      assertiveTimer = undefined
    }

    // Clear and re-set to trigger screen reader re-announcement
    element.textContent = ''
    nextTick(() => {
      element.textContent = msg
      message.value = msg
    })

    const resolvedTimeout = timeout ?? defaultTimeout
    if (resolvedTimeout > 0) {
      const timer = setTimeout(() => {
        element.textContent = ''
      }, resolvedTimeout)

      if (mode === 'polite')
        politeTimer = timer
      else
        assertiveTimer = timer
    }
  }

  function polite(msg: string, timeout?: number) {
    announce(msg, 'polite', timeout)
  }

  function assertive(msg: string, timeout?: number) {
    announce(msg, 'assertive', timeout)
  }

  tryOnScopeDispose(() => {
    clearTimeout(politeTimer)
    clearTimeout(assertiveTimer)

    const count = announcerRefCount.get(idPrefix) || 0
    if (count <= 1) {
      const container = document?.getElementById(`${idPrefix}-container`)
      if (container)
        container.remove()
      announcerRefCount.delete(idPrefix)
    }
    else {
      announcerRefCount.set(idPrefix, count - 1)
    }
  })

  return {
    message,
    announce,
    polite,
    assertive,
  }
}
