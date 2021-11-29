import { ref } from 'vue-demi'
import { isClient, useCssVar, useEventListener } from '@vueuse/core'

const variablePrefix = '--vue-use-safe-area-'

/**
 * screen safe area
 *
 * @see https://vueuse.org/useSafeArea
 */
export function useSafeArea() {
  const top = ref('')
  const right = ref('')
  const bottom = ref('')
  const left = ref('')

  if (isClient) {
    const topCssVar = useCssVar(`${variablePrefix}-top`)
    const rightCssVar = useCssVar(`${variablePrefix}-right`)
    const bottomCssVar = useCssVar(`${variablePrefix}-bottom`)
    const leftCssVar = useCssVar(`${variablePrefix}-left`)

    topCssVar.value = 'env(safe-area-inset-top, 0px)'
    rightCssVar.value = 'env(safe-area-inset-right, 0px)'
    bottomCssVar.value = 'env(safe-area-inset-bottom, 0px)'
    leftCssVar.value = 'env(safe-area-inset-left, 0px)'

    update()

    useEventListener('orientationchange', update)
  }

  function update() {
    top.value = getValue('top')
    right.value = getValue('right')
    bottom.value = getValue('bottom')
    left.value = getValue('left')
  }

  return {
    top,
    right,
    bottom,
    left,
    update,
  }
}

function getValue(position: 'top' | 'right' | 'bottom' | 'left') {
  return getComputedStyle(document.documentElement).getPropertyValue(`${variablePrefix}-${position}`)
}
