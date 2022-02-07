import { ref, watch } from 'vue-demi'
import type { Ref } from 'vue-demi'
import { unrefElement, useEventListener, useIntersectionObserver } from '@vueuse/core'
import type { IntersectionObserverOptions, MaybeElementRef } from '@vueuse/core'

export interface UseImageLazyLoadReturn {
  isLoading: Ref<boolean>
  isComplete: Ref<boolean>
  src: Ref<string>
}
export interface UseImageLazyLoadOptions extends IntersectionObserverOptions {
  src: string
}

export function useImageLazyLoad(target: MaybeElementRef, options: UseImageLazyLoadOptions): UseImageLazyLoadReturn {
  const { src: dataSrc, ...args } = options
  const isLoading = ref(false)
  const isComplete = ref(false)
  const src = ref('')
  const execute = () => {
    isLoading.value = true
    src.value = dataSrc
  }
  const { isSupported } = useIntersectionObserver(target, ([{ isIntersecting }]) => {
    if (isIntersecting && !isComplete.value)
      execute()
  }, args)
  watch(() => unrefElement(target), (target) => {
    useEventListener(unrefElement(target), 'load', () => {
      isLoading.value = false
      isComplete.value = true
    })
  })
  if (!isSupported)
    execute()
  return {
    isLoading,
    isComplete,
    src,
  }
}
