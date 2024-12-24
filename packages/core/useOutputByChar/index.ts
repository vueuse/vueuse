import { ref } from 'vue-demi'
import type { Ref } from 'vue-demi'

interface ReturnType {
  start: (text: string) => void
  stop: () => void
  done: () => string
  clear: () => void
  showText: Ref<string>
  pending: Ref<boolean>
}

export function useOutputByChar(time?: number, charLength: number = 1): ReturnType {
  let idx = 0
  let txt = ''
  const showText = ref('')
  const pending = ref(false)
  let timerId: number
  let update: (cb: () => void) => number
  let stopUpdate: (id: number) => void

  if (window.requestAnimationFrame && (!time || (time && time <= 16))) {
    update = window.requestAnimationFrame
    stopUpdate = window.cancelAnimationFrame
  }
  else {
    update = cb => setTimeout(cb, time) as unknown as number
    stopUpdate = clearTimeout
  }

  const change = () => {
    idx += charLength
    showText.value = txt.slice(0, idx)
    if (idx < txt.length) {
      timerId = update(change)
    }
    else {
      stopUpdate(timerId)
      timerId = 0
    }
  }

  const start = (text: string) => {
    txt += text
    pending.value = true
    if (idx < txt.length && !timerId) {
      timerId = update(change)
    }
  }

  const stop = () => {
    stopUpdate(timerId)
    timerId = 0
    pending.value = false
  }

  const done = () => {
    stopUpdate(timerId)
    timerId = 0
    pending.value = false
    return showText.value = txt
  }

  const clear = () => {
    stopUpdate(timerId)
    idx = 0
    txt = ''
    showText.value = ''
    timerId = 0
    pending.value = false
  }

  return { showText, pending, start, stop, done, clear }
}
