import { tryOnMounted } from '@vueuse/shared'
import { ref, Ref, watch } from 'vue-demi'
import { useWindowScroll } from '../useWindowScroll'
import { ConfigurableWindow, defaultWindow } from '../_configurable'

export function useElementVisibility(element: Ref<Element|null|undefined>, { window = defaultWindow }: ConfigurableWindow = {}) {
  const { x, y } = useWindowScroll({ window })
  const elementIsVisible = ref(false)

  const testBoundingClientRect = () => {
    if (!window)
      return

    const document = window.document
    if (!element.value) {
      elementIsVisible.value = false
    }
    else {
      const rect = element.value.getBoundingClientRect()

      elementIsVisible.value = (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight)
          && rect.left <= (window.innerWidth || document.documentElement.clientWidth)
          && rect.bottom >= 0
          && rect.right >= 0
      )
    }
  }

  tryOnMounted(testBoundingClientRect)

  watch(x, testBoundingClientRect)
  watch(y, testBoundingClientRect)

  return elementIsVisible
}
