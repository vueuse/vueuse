import { ref, Ref, watch } from '../api'

export function useMouse (target: Ref<Element> = ref(document.body), handleOutside = false) {
  const documentX = ref(0)
  const documentY = ref(0)
  const elementX = ref(0)
  const elementY = ref(0)
  const elementPositionX = ref(0)
  const elementPositionY = ref(0)
  const elementHeight = ref(0)
  const elementWidth = ref(0)
  const isOutside = ref(false)

  const stop = watch(target, (el: Element, prevEl, onCleanup) => {
    const moveHandler = (event: MouseEvent) => {
      const ele = el || document.body
      const {
        left,
        top,
        width,
        height,
      } = ele.getBoundingClientRect()

      documentX.value = event.pageX
      documentY.value = event.pageY
      elementPositionX.value = left + window.pageXOffset
      elementPositionY.value = top + window.pageYOffset
      elementHeight.value = height
      elementWidth.value = width

      const elX = event.pageX - elementPositionX.value
      const elY = event.pageY - elementPositionY.value
      isOutside.value = elX < 0 || elY < 0 || elX > elementWidth.value || elY > elementHeight.value

      if (handleOutside || !isOutside.value) {
        elementX.value = elX
        elementY.value = elY
      }
    }

    document.addEventListener('mousemove', moveHandler)

    onCleanup(() => {
      document.removeEventListener('mousemove', moveHandler)
    })
  })

  return {
    x: documentX,
    y: documentY,
    documentX,
    documentY,
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
