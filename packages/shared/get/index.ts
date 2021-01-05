import { Ref } from 'vue-demi'

/**
 * Shorthand for accessing `ref.value`
 */
export function get<T>(ref: Ref<T>): T {
  return ref.value
}
