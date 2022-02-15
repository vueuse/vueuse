import { computed, defineComponent, h, ref, toRefs } from 'vue-demi'
import { onClickOutside } from '../onClickOutside'
import type { MenuItem, MenuPosition } from '.'

export const ContextMenu = defineComponent({
  setup(props) {
    const { items, position } = toRefs(props)

    const style = computed(() => `position:fixed; top: ${position.value!.y}px; left:${position.value!.x}px;`)

    const contextMenu = ref<HTMLElement>()

    onClickOutside(contextMenu, () => {
      contextMenu.value!.style.display = 'none'
    })

    return () => {
      return h(
        'div',
        {
          style: style.value,
          class: 'bg-$vt-c-bg',
          ref: contextMenu,
        },
        [
          items.value!.map((item) => {
            return h('div', {
              class: 'block px-4 py-2 hover:bg-emerald-600 cursor-pointer',
              onClick() {
                item.handler?.()
              },
            }, [item.text])
          }),
        ],
      )
    }
  },
  props: {
    items: {
      type: Array as () => MenuItem[],
    },
    position: {
      type: Object as () => MenuPosition,
    },
  },
})
