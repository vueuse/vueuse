import type { ToRefs } from 'vue-demi'
import type { UseVModelOptions } from '../useVModel'
import { useVModel } from '../useVModel'

/**
 * Shorthand for props v-model binding. Think like `toRefs(props)` but changes will also emit out.
 *
 * @see https://vueuse.org/useVModels
 * @param props
 * @param emit
 * @param options
 */
export function useVModels<P extends object, Name extends string>(
  props: P,
  emit?: (name: Name, ...args: any[]) => void,
  options?: UseVModelOptions<any, true>,
): ToRefs<P>
export function useVModels<P extends object, Name extends string>(
  props: P,
  emit?: (name: Name, ...args: any[]) => void,
  options?: UseVModelOptions<any, false>,
): ToRefs<P>
export function useVModels<P extends object, Name extends string, Passive extends boolean>(
  props: P,
  emit?: (name: Name, ...args: any[]) => void,
  options: UseVModelOptions<any, Passive> = {},
): ToRefs<P> {
  const ret: any = {}

  for (const key in props) {
    ret[key] = useVModel(
      props,
      key,
      emit,
      options as Parameters<typeof useVModel>[3],
    )
  }
  return ret
}
