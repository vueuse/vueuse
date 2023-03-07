import { ref } from 'vue-demi'
import type { Ref } from 'vue-demi'
import { createEventHook, tryOnMounted, tryOnScopeDispose } from '@vueuse/shared'
import type { EventHook } from '@vueuse/shared'
import { useEventListener } from '../useEventListener'
import type { ConfigurableWindow } from '../_configurable'
import { defaultWindow } from '../_configurable'
import { useSupported } from '../useSupported'

export interface WebNotificationOptions {
  /**
   * The title read-only property of the Notification interface indicates
   * the title of the notification
   *
   * @default ''
   */
  title?: string
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
   * Specifies a vibration pattern for devices with vibration hardware to emit.
   * A vibration pattern, as specified in the Vibration API spec
   *
   * @see https://w3c.github.io/vibration/
   */
  vibrate?: number[]
}

export interface UseWebNotificationOptions extends WebNotificationOptions, ConfigurableWindow {
}

/**
 * Reactive useWebNotification
 *
 * @see https://vueuse.org/useWebNotification
 * @see https://developer.mozilla.org/en-US/docs/Web/API/notification
 * @param title
 * @param defaultOptions of type WebNotificationOptions
 * @param methods of type WebNotificationMethods
 */
export const useWebNotification = (
  defaultOptions: UseWebNotificationOptions = {},
) => {
  const {
    window = defaultWindow,
  } = defaultOptions

  const isSupported = useSupported(() => !!window && 'Notification' in window)

  const notification: Ref<Notification | null> = ref(null)

  // Request permission to use web notifications:
  const requestPermission = async () => {
    if (!isSupported.value)
      return

    if ('permission' in Notification && Notification.permission !== 'denied')
      await Notification.requestPermission()
  }

  const { on: onClick, trigger: clickTrigger }: EventHook = createEventHook<Event>()
  const { on: onShow, trigger: showTrigger }: EventHook = createEventHook<Event>()
  const { on: onError, trigger: errorTrigger }: EventHook = createEventHook<Event>()
  const { on: onClose, trigger: closeTrigger }: EventHook = createEventHook<Event>()

  // Show notification method:
  const show = async (overrides?: WebNotificationOptions) => {
    if (!isSupported.value)
      return

    await requestPermission()
    const options = Object.assign({}, defaultOptions, overrides)
    notification.value = new Notification(options.title || '', options)

    notification.value.onclick = clickTrigger
    notification.value.onshow = showTrigger
    notification.value.onerror = errorTrigger
    notification.value.onclose = closeTrigger

    return notification.value
  }

  // Close notification method:
  const close = (): void => {
    if (notification.value)
      notification.value.close()
    notification.value = null
  }

  // On mount, attempt to request permission:
  tryOnMounted(async () => {
    if (isSupported.value)
      await requestPermission()
  })

  // Attempt cleanup of the notification:
  tryOnScopeDispose(close)

  // Use close() to remove a notification that is no longer relevant to to
  // the user (e.g.the user already read the notification on the webpage).
  // Most modern browsers dismiss notifications automatically after a few
  // moments(around four seconds).
  if (isSupported.value && window) {
    const document = window.document
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
    onClick,
    onShow,
    onError,
    onClose,
  }
}

export type UseWebNotificationReturn = ReturnType<typeof useWebNotification>
