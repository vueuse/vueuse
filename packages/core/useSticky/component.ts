import { defineComponent, h, ref, computed, CSSProperties } from 'vue-demi'
import { UseStickyOptions, useSticky } from '@vueuse/core'
import { RenderableComponent } from '../types'

export interface UseStickyProps extends UseStickyOptions, RenderableComponent {
  zIndex?: number
}

export const UseSticky = defineComponent<UseStickyProps>({
  name: 'UseSticky',
  props: [
    'scrollTarget',
    'offsetTop',
    'offsetBottom',
    'position',
    'zIndex',
    'as',
  ] as unknown as undefined,
  setup(props, { slots }) {
    const el = ref()
    const scrollTarget = computed(() => props.scrollTarget ?? window) as UseStickyOptions['scrollTarget']

    const { isFixed, width, height, offset } = useSticky(el, {
      position: props.position,
      offsetTop: props.offsetTop,
      offsetBottom: props.offsetBottom,
      scrollTarget,
    })

    const rootStyle = computed<CSSProperties | undefined>(() => {
      if (isFixed.value) {
        return {
          width: `${width.value}px`,
          height: `${height.value}px`,
        }
      }
    })
    const stickyStyle = computed<CSSProperties | undefined>(() => {
      if (isFixed.value) {
        return {
          position: 'fixed',
          zIndex: props.zIndex ?? 'auto',
          [props.position ?? 'top' as string]: `${offset}px`,
          width: `${width.value}px`,
          height: `${height.value}px`,
        }
      }
    })

    return () => {
      if (slots.default) {
        return h(props.as || 'div', { ref: el, style: rootStyle.value }, [
          h(props.as || 'div', { style: stickyStyle.value }, slots.default?.({ isFixed })),
        ])
      }
    }
  },
})
