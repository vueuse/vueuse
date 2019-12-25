import { ref, Ref, watch } from '../api'

export interface MouseState {
  docX: number
  docY: number
  posX: number
  posY: number
  elX: number
  elY: number
  elH: number
  elW: number
}

export function useMouse (refEl: Ref<Element | null> = ref(null)) {
  const state = ref<MouseState>({
    docX: 0,
    docY: 0,
    posX: 0,
    posY: 0,
    elX: 0,
    elY: 0,
    elH: 0,
    elW: 0,
  })

  const stop = watch(refEl, (el: Element | null, prevEl, onCleanup) => {
    const moveHandler = (event: MouseEvent) => {
      const ele = el || document.body
      const {
        left,
        top,
        width: elW,
        height: elH,
      } = ele.getBoundingClientRect()
      const posX = left + window.pageXOffset
      const posY = top + window.pageYOffset
      const elX = event.pageX - posX
      const elY = event.pageY - posY

      Object.assign(state.value, {
        docX: event.pageX,
        docY: event.pageY,
        posX,
        posY,
        elX,
        elY,
        elH,
        elW,
      })
    }

    document.addEventListener('mousemove', moveHandler)

    onCleanup(() => {
      document.removeEventListener('mousemove', moveHandler)
    })
  })

  return { state, stop }
}
