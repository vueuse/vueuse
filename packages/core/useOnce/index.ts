import { ref } from 'vue-demi'

export const useOnce = (cb: Function) => {
  const canUse = ref(true)

  // 执行
  const action = () => {
    if (canUse.value) {
      canUse.value = false
      return cb()
    }
  }

  // 继续使用
  const resume = () => {
    canUse.value = true
  }

  return {
    canUse,
    resume,
    action,
  }
}
