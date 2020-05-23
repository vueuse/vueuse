/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { reactive } from '../../api'

export function createGlobalState<T extends object>(
  factory: () => T,
) {
  const state = reactive(factory()) as T

  return () => state
}
