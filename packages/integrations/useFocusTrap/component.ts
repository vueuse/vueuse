import type { RenderableComponent } from '@vueuse/core'
import type { FocusTrap } from 'focus-trap'
import type { UseFocusTrapOptions } from '.'
import { unrefElement } from '@vueuse/core'
import { createFocusTrap } from 'focus-trap'
import { defineComponent, h, onScopeDispose, ref, watch } from 'vue'

export interface ComponentUseFocusTrapOptions extends RenderableComponent {
  options?: UseFocusTrapOptions
}

export const UseFocusTrap = /* #__PURE__ */ defineComponent <ComponentUseFocusTrapOptions> ({
  name: 'UseFocusTrap',
  props: ['as', 'options'] as unknown as undefined,
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
        trap = createFocusTrap(el, props.options || {})
        activate()
      },
      { flush: 'post' },
    )

    // Cleanup on unmount
    onScopeDispose(() => deactivate())

    return () => {
      if (slots.default)
        return h(props.as || 'div', { ref: target }, slots.default())
    }
  },
})
