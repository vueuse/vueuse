import { ref } from 'vue-demi'
import { isClient, useCssVar, useEventListener } from '@vueuse/core'

const topVarName = '--vue-use-safe-area-top'
const rightVarName = '--vue-use-safe-area-right'
const bottomVarName = '--vue-use-safe-area-bottom'
const leftVarName = '--vue-use-safe-area-left'

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
    const topCssVar = useCssVar(topVarName)
    const rightCssVar = useCssVar(rightVarName)
    const bottomCssVar = useCssVar(bottomVarName)
    const leftCssVar = useCssVar(leftVarName)

    topCssVar.value = 'env(safe-area-inset-top, 0px)'
    rightCssVar.value = 'env(safe-area-inset-right, 0px)'
    bottomCssVar.value = 'env(safe-area-inset-bottom, 0px)'
    leftCssVar.value = 'env(safe-area-inset-left, 0px)'

    update()

    useEventListener('orientationchange', update)
  }

  function update() {
    top.value = getValue(topVarName)
    right.value = getValue(rightVarName)
    bottom.value = getValue(bottomVarName)
    left.value = getValue(leftVarName)
  }

  return {
    top,
    right,
    bottom,
    left,
    update,
  }
}

type VarName = '--vue-use-safe-area-top' | '--vue-use-safe-area-right' | '--vue-use-safe-area-bottom' | '--vue-use-safe-area-left'

function getValue(position: VarName) {
  return getComputedStyle(document.documentElement).getPropertyValue(position)
}
