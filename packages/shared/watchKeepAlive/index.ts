import { onActivated, onDeactivated, watch } from 'vue-demi'

// implementation
export function watchKeepAlive(...args: Parameters<typeof watch>) {
  let watchUnsubscribe: ReturnType<typeof watch> = () => {}

  onActivated(() => {
    watchUnsubscribe = watch(...args)
  })

  onDeactivated(() => {
    watchUnsubscribe?.()
  })

  return watchUnsubscribe
}
