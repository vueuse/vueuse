import { computed, nextTick } from 'vue-demi'
import { useElementBounding } from '../useElementBounding'
import type { MaybeComputedElementRef } from '../unrefElement'

export function useElementCross(...targets: [MaybeComputedElementRef, MaybeComputedElementRef]) {
  const { top: t0, left: l0, width: w0, height: h0, update: update0 } = useElementBounding(targets[0])
  const { top: t1, left: l1, width: w1, height: h1, update: update1 } = useElementBounding(targets[1])

  const isCross = computed<boolean>(() => {
    return l1.value - l0.value >= -w1.value
      && l1.value - l0.value <= w0.value
      && t1.value - t0.value >= -h1.value
      && t1.value - t0.value <= h0.value
  })

  async function update() {
    await nextTick()
    update0()
    update1()
  }

  return {
    isCross,
    update,
  }
}

export type UseElementCrossReturn = ReturnType<typeof useElementCross>
