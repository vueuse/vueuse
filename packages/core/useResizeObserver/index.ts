import { Ref, unref, onBeforeUnmount, watchEffect } from 'vue-demi'

export function useResizeObserver(
  el: Ref<HTMLElement | null | undefined>,
  callback: (entries: any) => void,
) {
  const stop = watchEffect((onInvalidate) => {
    // @ts-ignore
    const observer = new ResizeObserver(callback)
    const _el = unref(el)
    _el && observer.observe(_el)

    onInvalidate(() => {
      observer.unobserve(_el)
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
