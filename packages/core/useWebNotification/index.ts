import { onMounted, onUnmounted, ref } from 'vue-demi'

import type { Ref } from 'vue-demi'

import { createEventHook } from '@vueuse/shared'

import type { EventHook } from '@vueuse/shared'

import { useEventListener } from '../useEventListener'

export interface WebNotificationOptions {
  /**
   * The title read-only property of the Notification interface indicates
   * the title of the notification
   *
   * @default ''
   */
  title: string
  /**
   * The body string of the notification as specified in the constructor's
   * options parameter.
   *
   * @default ''
   */
  body?: string
  /**
   * The text direction of the notification as specified in the constructor's
   * options parameter.
   *
   * @default ''
   */
  dir?: 'auto' | 'ltr' | 'rtl'
  /**
   * The language code of the notification as specified in the constructor's
   * options parameter.
   *
   * @default DOMString
   */
  lang?: string
  /**
   * The ID of the notification(if any) as specified in the constructor's options
   * parameter.
   *
   * @default ''
   */
  tag?: string
  /**
   * The URL of the image used as an icon of the notification as specified
   * in the constructor's options parameter.
   *
   * @default ''
   */
  icon?: string
  /**
   * Specifies whether the user should be notified after a new notification
   * replaces an old one.
   *
   * @default false
   */
  renotify?: boolean
  /**
   * A boolean value indicating that a notification should remain active until the
   * user clicks or dismisses it, rather than closing automatically.
   *
   * @default false
   */
  requireInteraction?: boolean
  /**
   * The silent read-only property of the Notification interface specifies
   * whether the notification should be silent, i.e., no sounds or vibrations
   * should be issued, regardless of the device settings.
   *
   * @default false
   */
  silent?: boolean
  /**
   *
   * Specifies a vibration pattern for devices with vibration hardware to emit.
   * A vibration pattern, as specified in the Vibration API spec
   * @see https://w3c.github.io/vibration/
   * @default [200, 100, 200]
   */
  vibrate?: []
}

/**
 * Reactive useWebNotification
 *
 * @see https://vueuse.org/useWebNotification
 * @see https://developer.mozilla.org/en-US/docs/Web/API/notification
 * @param title
 * @param options of type WebNotificationOptions
 * @param methods of type WebNotificationMethods
 */
export const useWebNotification = (
  options: WebNotificationOptions,
) => {
  const {
    title,
    body = '',
    dir = 'auto',
    lang = 'EN',
    tag = '',
    icon = '',
    renotify = false,
    requireInteraction = false,
    silent = false,
    vibrate = [200, 100, 200],
  } = options

  const notification: Ref<Notification | null> = ref(null)

  // Is the web notifications API supported?:
  const isSupported: boolean = 'Notification' in window

  // Request permission to use web notifications:
  const requestPermission = async() => {
    if ('permission' in Notification && Notification.permission !== 'denied') await Notification.requestPermission()
  }

  const notificationOnClick: EventHook = createEventHook<Event>()

  const notificationOnShow: EventHook = createEventHook<Event>()

  const notificationOnError: EventHook = createEventHook<Event>()

  const notificationOnClose: EventHook = createEventHook<Event>()

  // Show notification method:
  const show = (opts?: WebNotificationOptions): void => {
    if (isSupported) {
      notification.value = new Notification(
        title,
        opts || { body, dir, lang, tag, icon, renotify, requireInteraction, silent, vibrate },
      )

      notification.value.onclick = (event: Event) => notificationOnClick.trigger(event)
      notification.value.onshow = (event: Event) => notificationOnShow.trigger(event)
      notification.value.onerror = (event: Event) => notificationOnError.trigger(event)
      notification.value.onclose = (event: Event) => notificationOnClose.trigger(event)
    }
  }

  // Close notification method:
  const close = (): void => {
    if (notification.value) notification.value.close()
  }

  // On mount, attempt to request permission:
  onMounted(async() => {
    if (isSupported) await requestPermission()
  })

  // Attempt cleanup of the notification:
  onUnmounted(() => {
    if (notification.value) close()
    notification.value = null
  })

  // Use close() to remove a notification that is no longer relevant to to
  // the user (e.g.the user already read the notification on the webpage).
  // Most modern browsers dismiss notifications automatically after a few
  // moments(around four seconds).
  if (isSupported) {
    useEventListener(document, 'visibilitychange', (e: Event) => {
      e.preventDefault()

      if (document.visibilityState === 'visible') {
        // The tab has become visible so clear the now-stale Notification:
        close()
      }
    })
  }

  return {
    isSupported,
    notification,
    show,
    close,
    onClick: notificationOnClick,
    onShow: notificationOnShow,
    onError: notificationOnError,
    onClose: notificationOnClose,
  }
}
