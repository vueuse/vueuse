import { ref } from 'vue-demi'
import { isClient, useDebounceFn } from '@vueuse/shared'
import { useEventListener } from '../useEventListener'
import { useCssVar } from '../useCssVar'

const topVarName = '--vueuse-safe-area-top'
const rightVarName = '--vueuse-safe-area-right'
const bottomVarName = '--vueuse-safe-area-bottom'
const leftVarName = '--vueuse-safe-area-left'

/**
 * Reactive `env(safe-area-inset-*)`
 *
 * @see https://vueuse.org/useScreenSafeArea
 */
export function useScreenSafeArea() {
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

    useEventListener('resize', useDebounceFn(update))
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

type VarName = '--vueuse-safe-area-top' | '--vueuse-safe-area-right' | '--vueuse-safe-area-bottom' | '--vueuse-safe-area-left'

function getValue(position: VarName) {
  return getComputedStyle(document.documentElement).getPropertyValue(position)
}
