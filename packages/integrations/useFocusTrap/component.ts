import { defineComponent, h, onScopeDispose, ref, watch } from 'vue-demi'
import { createFocusTrap } from 'focus-trap'
import type { FocusTrap } from 'focus-trap'
import type { RenderableComponent } from '@vueuse/core'
import { unrefElement } from '@vueuse/core'

export const UseFocusTrap = defineComponent<RenderableComponent>({
  name: 'UseFocusTrap',
  props: ['as'] as unknown as undefined,
  setup(props, { slots }) {
    let trap: undefined | FocusTrap
    const target = ref()

    const activate = () => trap && trap.activate()
    const deactivate = () => trap && trap.deactivate()
    watch(
      () => unrefElement(target),
      (el) => {
        if (!el)
          return
        trap = createFocusTrap(el, {})
        activate()
      }, { flush: 'post' })

    // Cleanup on unmount
    onScopeDispose(() => deactivate())

    return () => {
      if (slots.default)
        return h(props.as || 'div', { ref: target }, slots.default())
    }
  },
})
