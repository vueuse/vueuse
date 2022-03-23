
import { onMounted, ref, Ref } from 'vue'
import { useEventListener } from '../useEventListener'


export type MaybeRef<T> = T | Ref<T>

export function useTouchMove(ele: MaybeRef<HTMLElement | Document | Window | null | undefined>) {
  let startY = ref(0)
  let disY = ref(0)
  let directionX = ref('')
  let directionY = ref('')
  let disX = ref(0)
  let startX = ref(0)



  function handleTouchStart(e: Event) {
    startY.value = (e as TouchEvent).touches[0].clientY
    startX.value = (e as TouchEvent).touches[0].clientX
  }

  function handleTouchMove(e: Event) {
    const moveY = (e as TouchEvent).touches[0].clientY
    const moveX = (e as TouchEvent).touches[0].clientX


    disY.value = moveY - startY.value
    disX.value = moveX - startX.value

    // console.log(disY)
    if (disY.value > 0) {
      // 下滑
      directionY.value = 'slide downward'
    } else {
      disY.value = - disY.value
      directionY.value = 'slide up'
    }

    if (disX.value > 0) {
      // 下滑
      directionX.value = 'Right slip'
    } else {
      disX.value = - disX.value
      directionX.value = 'Left slip'
    }


  }

  onMounted(() => {
    useEventListener(ele, 'touchstart', handleTouchStart)
    useEventListener(ele, 'touchmove', handleTouchMove)
  })



  return {
    disX,
    disY,
    directionX,
    directionY
  }

}