import { onBeforeUnmount, Ref, unref, watchEffect } from 'vue-demi'

export function useMutationObserver(
  el: Ref<HTMLElement | null | undefined>,
  callback: MutationCallback,
  options?: MutationObserverInit,
) {
  const stop = watchEffect((onInvalidate) => {
    const observer = new MutationObserver(callback)
    const _el = unref(el)
    _el && observer.observe(_el, options)

    onInvalidate(() => {
      observer.disconnect()
    })
  })

  onBeforeUnmount(() => {
    stop()
  })

  return {
    stop,
  }
}
