import { onBeforeUnmount } from 'vue-demi'
import { tryOnMounted } from '@vueuse/shared'

export type EffectFn<T = void> = () => T
export type Effect = EffectFn<void | EffectFn>

export function onMountedEffect(effect: Effect) {
  let onCleanup: EffectFn

  tryOnMounted(() => {
    const effectFn = effect()

    if (effectFn instanceof Promise) {
      effectFn.then((cb: EffectFn) => (onCleanup = cb))
      return
    }

    if (typeof effectFn === 'function')
      onCleanup = effectFn
  })

  onBeforeUnmount(() => {
    onCleanup && onCleanup()
  })
}
