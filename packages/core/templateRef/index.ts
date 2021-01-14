import { ref, Ref, getCurrentInstance, onMounted, onUpdated, onBeforeUnmount, Vue, onUnmounted } from 'vue-demi'

/**
 * Use reactive $refs in Vue 2,3
 *
 * @see   {@link https://vueuse.js.org/core/templateRef}
 * @param key
 * @param initialValue
 */
export function templateRef<T extends Element | Element[] | typeof Vue | typeof Vue[] | null | undefined>(
  key: string,
  initialValue: T,
): Ref<T> {
  const instance = getCurrentInstance()
  const $target = ref(initialValue) as Ref<T>

  const sync = () => {
    $target.value = instance?.proxy?.$refs[key] as T ?? initialValue
  }

  onMounted(() => sync())

  onUpdated(() => sync())

  onBeforeUnmount(() => sync())

  onUnmounted(() => sync())

  return $target
}
