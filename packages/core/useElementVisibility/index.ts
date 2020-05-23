import { onMounted, ref, Ref, watch } from '../../api'
import { useWindowScroll } from '../useWindowScroll'

export function useElementVisibility(element: Ref<Element>) {
  const { x, y } = useWindowScroll()
  const elementIsVisible = ref(false)

  const testBoundingClientRect = () => {
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

  onMounted(testBoundingClientRect)

  watch(x, testBoundingClientRect)
  watch(y, testBoundingClientRect)

  return elementIsVisible
}
