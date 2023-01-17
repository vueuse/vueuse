import { defineComponent, h, toRefs } from 'vue-demi'
import type { UseVirtualListOptions } from '@vueuse/core'
import { useVirtualList } from '@vueuse/core'

export interface UseVirtualListProps {
  /**
   * data of scrollable list
   *
   * @default []
   */
  list: Array<any>
  /**
   * useVirtualList's options
   *
   * @default {}
   */
  options: UseVirtualListOptions
  /**
   * virtualList's height
   *
   * @default 300px
   */
  height: string
}

export const UseVirtualList = /* #__PURE__ */ defineComponent<UseVirtualListProps>({
  name: 'UseVirtualList',
  props: [
    'list',
    'options',
    'height',
  ] as unknown as undefined,
  setup(props, { slots, expose }) {
    const { list: listRef } = toRefs(props)

    const { list, containerProps, wrapperProps, scrollTo } = useVirtualList(listRef, props.options)
    expose({ scrollTo })

    typeof containerProps.style === 'object' && !Array.isArray(containerProps.style) && (containerProps.style.height = props.height || '300px')

    return () => h('div',
      { ...containerProps },
      [
        h('div',
          { ...wrapperProps.value },
          list.value.map((item: any) => h('div',
            { style: { overFlow: 'hidden', height: item.height } },
            slots.default ? slots.default(item) : 'Please set content!',
          )),
        ),
      ],
    )
  },
})
