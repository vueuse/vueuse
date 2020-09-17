import { Ref, unref, onBeforeUnmount, watchEffect } from 'vue-demi'

export function useResizeObserver(
  el: Ref<HTMLElement | null | undefined>,
  callback: ResizeObserverCallback,
) {
  const stop = watchEffect((onInvalidate) => {
    const observer = new ResizeObserver(callback)
    const _el = unref(el)
    _el && observer.observe(_el)

    onInvalidate(() => {
      const _el = unref(el)
      _el && observer.unobserve(_el)
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
