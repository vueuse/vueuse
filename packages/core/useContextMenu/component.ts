import { defineComponent, h, reactive, ref } from 'vue-demi'
import type { RenderableComponent, UseContextMenuOptions } from '@vueuse/core'
import { useContextMenu } from '@vueuse/core'
export interface useContextMenuProps extends UseContextMenuOptions, RenderableComponent {

}

export const UseContextMenu = defineComponent<useContextMenuProps>({
  name: 'UseContextMenu',
  setup(props, { slots }) {
    const menuElementRef = ref()
    const targetRef = ref()
    const data = reactive(useContextMenu(menuElementRef, {
      ...props,
      target: slots.target ? targetRef : undefined,
    }))

    const tag = props.as || 'div'
    return () => {
      if (slots.target && slots.menu) {
        return h(tag, [
          h(tag, { ref: targetRef }, slots.target(data)),
          h(tag, { ref: menuElementRef }, slots.menu(data)),
        ])
      }
      return h(props.as || 'div', { ref: menuElementRef }, (slots.default || slots.menu)?.(data))
    }
  },
})
