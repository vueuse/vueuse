import { ref, Ref, getCurrentInstance, onMounted, onUpdated, onBeforeUnmount, Vue } from 'vue-demi'

export function templateRef<T extends Element | Element[] | typeof Vue | typeof Vue[]>(
  key: string,
  initialValue: T,
): Ref<T>

export function templateRef<T extends Element | Element[] | typeof Vue | typeof Vue[] | null | undefined>(
  key: string,
  initialValue?: T,
): Ref<T>

/**
 * Use reactive $refs in Vue 2,3
 *
 * @see   {@link https://vueuse.js.org/core/templateRef}
 * @param key
 * @param initialValue
 */
export function templateRef<T extends Element | Element[] | typeof Vue | typeof Vue[] | null | undefined>(
  key: string,
  initialValue: any = undefined,
) {
  const instance = getCurrentInstance()
  const $target = ref(initialValue) as Ref<T | null | undefined>

  const sync = () => {
    $target.value = instance?.proxy?.$refs[key] as T
  }

  onMounted(() => sync())

  onUpdated(() => sync())

  onBeforeUnmount(() => sync())

  return $target
}
