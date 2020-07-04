import { ref, Ref, watch, WatchStopHandle } from 'vue-demi'

export function useMouseInElement(
  target: Ref<HTMLElement | null> = ref(document.body) as Ref<HTMLElement>,
  options: {
    handleOutside?: boolean
    touch?: boolean
    resetOnTouchEnds?: boolean
    initial?: {x: number; y: number}
  } = {}) {
  const {
    handleOutside = false,
    touch = true,
  } = options

  const x = ref(0)
  const y = ref(0)
  const elementX = ref(0)
  const elementY = ref(0)
  const elementPositionX = ref(0)
  const elementPositionY = ref(0)
  const elementHeight = ref(0)
  const elementWidth = ref(0)
  const isOutside = ref(false)

  const stop: WatchStopHandle = watch(target, (el, prevEl, onCleanup) => {
    const moveHandler = (event: MouseEvent | TouchEvent) => {
      const ele = el || document.body
      const {
        left,
        top,
        width,
        height,
      } = ele.getBoundingClientRect()

      if (event instanceof TouchEvent && event.touches.length <= 0)
        return

      x.value = event instanceof MouseEvent ? event.pageX : event.touches[0].clientX
      y.value = event instanceof MouseEvent ? event.pageY : event.touches[0].clientY
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
  }, { immediate: true })

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
