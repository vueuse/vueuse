import { h, ref, defineComponent } from 'vue-demi'
import { useMouseInElement, MouseInElementOptions } from '.'

export const UseMouseInElement = defineComponent<{ options: MouseInElementOptions }>({
  name: 'UseMouseElement',
  setup(props, { slots, emit }) {
    const target = ref()
    const {
      x,
      y,
      elementX,
      elementY,
      elementPositionX,
      elementPositionY,
      elementWidth,
      elementHeight,
      isOutside,
      sourceType,
    } = useMouseInElement(target, props.options)

    return () => {
      if (slots.default) {
        return h('div', { ref: target }, slots.default({
          x: x.value,
          y: y.value,
          elementX: elementX.value,
          elementY: elementY.value,
          elementPositionX: elementPositionX.value,
          elementPositionY: elementPositionY.value,
          elementWidth: elementWidth.value,
          elementHeight: elementHeight.value,
          isOutside: isOutside.value,
          sourceType: sourceType.value,
        }))
      }
    }
  },
})
