import { ref, Ref, watch } from 'vue-demi'
import { ConfigurableWindow, defaultWindow } from '../_configurable'

export interface MouseInElementOptions extends ConfigurableWindow {
  handleOutside?: boolean
  touch?: boolean
  resetOnTouchEnds?: boolean
  initial?: {x: number; y: number}
}

export function useMouseInElement(
  target?: HTMLElement | Ref<HTMLElement | null>,
  options: MouseInElementOptions = {}) {
  const {
    handleOutside = false,
    touch = true,
    window = defaultWindow,
  } = options

  const targetRef = ref(target || window?.document.body)
  const x = ref(0)
  const y = ref(0)
  const elementX = ref(0)
  const elementY = ref(0)
  const elementPositionX = ref(0)
  const elementPositionY = ref(0)
  const elementHeight = ref(0)
  const elementWidth = ref(0)
  const isOutside = ref(false)

  let stop = () => {}

  if (window) {
    const document = window.document

    stop = watch(
      targetRef,
      (el, prevEl, onCleanup) => {
        const moveHandler = (event: MouseEvent | TouchEvent) => {
          const ele: HTMLElement = el || document.body
          const {
            left,
            top,
            width,
            height,
          } = ele.getBoundingClientRect()
          if (!(event instanceof MouseEvent) && event.touches.length <= 0)
            return

          x.value = event instanceof MouseEvent
            ? event.pageX
            : event.touches[0].clientX
          y.value = event instanceof MouseEvent
            ? event.pageY
            : event.touches[0].clientY

          elementPositionX.value = left + window.pageXOffset
          elementPositionY.value = top + window.pageYOffset
          elementHeight.value = height
          elementWidth.value = width

          const elX = x.value - elementPositionX.value
          const elY = y.value - elementPositionY.value
          isOutside.value = elX < 0 || elY < 0 || elX > elementWidth.value || elY > elementHeight.value

          if (handleOutside || !isOutside.value) {
            elementX.value = elX
            elementY.value = elY
          }
        }

        document.addEventListener('mousemove', moveHandler)
        if (touch)
          document.addEventListener('touchmove', moveHandler)

        onCleanup(() => {
          document.removeEventListener('mousemove', moveHandler)
          if (touch)
            document.removeEventListener('touchmove', moveHandler)
        })
      },
      { immediate: true },
    )
  }

  return {
    x,
    y,
    elementX,
    elementY,
    elementPositionX,
    elementPositionY,
    elementHeight,
    elementWidth,
    isOutside,
    stop,
  }
}
