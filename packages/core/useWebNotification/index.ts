import { onMounted, Ref, ref, onUnmounted } from 'vue-demi'

interface WebNotificationOptions {
  /*
   *
   * The body string of the notification as specified in the constructor's options parameter.
   *
   **/
  body?: string
  /*
   *
   * The text direction of the notification as specified in the constructor's options parameter.
   *
   **/
  dir?: 'auto' | 'ltr' | 'rtl'
  /*
   *
   * The language code of the notification as specified in the constructor's options parameter.
   *
   **/
  lang?: string
  /*
   *
   * The ID of the notification(if any) as specified in the constructor's options parameter.
   *
   **/
  tag?: string
  /*
   *
   * The URL of the image used as an icon of the notification as specified in the constructor's options parameter.
   *
   **/
  icon?: string
  /*
   *
   * Specifies whether the user should be notified after a new notification replaces an old one.
   *
   **/
  renotify?: boolean
  /*
   *
   * A boolean value indicating that a notification should remain active until the user clicks or dismisses it, rather than closing automatically.
   *
   **/
  requireInteraction?: boolean
}

interface WebNotificationMethods {
  /*
   *
   * A handler for the click event. It is triggered each time the user clicks on the notification.
   *
   **/
  onClick: ((e: Event) => void) | null
  /*
   *
   * A handler for the close event. It is triggered when the user closes the notification.
   *
   **/
  onClose: ((e: Event) => void) | null
  /*
   *
   * A handler for the error event. It is triggered each time the notification encounters an error.
   *
   **/
  onError: ((e: Event) => void) | null
  /*
   *
   * A handler for the show event. It is triggered when the notification is displayed.
   *
   **/
  onShow: ((e: Event) => void) | null
}

// Default notification methods:
const defaultWebNotificationMethods = {
  onClick: null,
  onShow: null,
  onError: null,
  onClose: null,
}

/**
 * Reactive useWebNotification
 *
 * @see https://vueuse.org/useNotification
 * @param title
 * @param options of type NotificationOptions
 * @param methods of type NotificationMethods
 */
export const useWebNotification = (
  title: string,
  options: WebNotificationOptions = {},
  methods: WebNotificationMethods = defaultWebNotificationMethods,
) => {
  const notification: Ref<Notification | null> = ref(null)

  const requestPermission = async() => {
    if ('permission' in Notification && Notification.permission !== 'denied') await Notification.requestPermission()
  }

  onMounted(requestPermission)

  onUnmounted(() => {
    notification.value = null
  })

  const showNotification = (): void => {
    notification.value = new Notification(title, options)
    notification.value.onclick = methods.onClick
    notification.value.onshow = methods.onShow
    notification.value.onerror = methods.onError
    notification.value.onclose = methods.onClose
  }

  return {
    notification,
    showNotification,
  }
}
