import { reactive } from '../../api'

export function createGlobalState<T extends object>(
  factory: () => T,
) {
  const state = reactive(factory()) as T

  return () => state
}
