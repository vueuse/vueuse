import type { UseVirtualListOptions } from '@vueuse/core'
import { useVirtualList } from '@vueuse/core'
import { defineComponent, h, toRefs } from 'vue'

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

    if (containerProps.style && typeof containerProps.style === 'object' && !Array.isArray(containerProps.style))
      containerProps.style.height = props.height || '300px'

    return () => h('div', { ...containerProps }, [
      h('div', { ...wrapperProps.value }, list.value.map((item: any) => h('div', { style: { overflow: 'hidden', height: item.height } }, slots.default ? slots.default(item) : 'Please set content!'))),
    ])
  },
})
