import { onMounted, onBeforeUnmount } from 'vue-demi'

export type EffectFn<T = void> = () => T
export type Effect = EffectFn<void | EffectFn>

export function onMountedEffect(effect: Effect) {
  let onCleanup: EffectFn

  onMounted(() => {
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
