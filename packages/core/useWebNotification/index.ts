import { onMounted, onUnmounted, ref } from 'vue-demi'

import type { Ref } from 'vue-demi'

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
}

interface WebNotificationMethods {
  /**
   * A handler for the click event. It is triggered each time the user clicks on the notification.
   *
   * @default null
   */
  onClick: ((e: Event) => void) | null
  /**
   * A handler for the close event. It is triggered when the user closes the notification.
   *
   * @default null
   */
  onClose: ((e: Event) => void) | null
  /**
   * A handler for the error event. It is triggered each time the notification encounters an error.
   *
   * @default null
   */
  onError: ((e: Event) => void) | null
  /**
   * A handler for the show event. It is triggered when the notification is displayed.
   *
   * @default null
   */
  onShow: ((e: Event) => void) | null
}

// Default web notification methods:
const defaultWebNotificationMethods = {
  onClick: null,
  onShow: null,
  onError: null,
  onClose: null,
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
  methods: WebNotificationMethods = defaultWebNotificationMethods,
) => {
  const { title } = options

  const notification: Ref<Notification | null> = ref(null)

  // Is the web notifications API supported?:
  const isSupported: boolean = 'Notification' in window

  // Request permission to use web notifications:
  const requestPermission = async() => {
    if ('permission' in Notification && Notification.permission !== 'denied') await Notification.requestPermission()
  }

  // Show notification method:
  const show = (): void => {
    if (isSupported) {
      notification.value = new Notification(title, options)
      notification.value.onclick = methods.onClick
      notification.value.onshow = methods.onShow
      notification.value.onerror = methods.onError
      notification.value.onclose = methods.onClose
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
  }
}
