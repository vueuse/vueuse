import type { ComponentInternalInstance } from 'vue'
import { getCurrentInstance } from 'vue'

export function getLifeCycleTarget(target?: ComponentInternalInstance | null) {
  return target || getCurrentInstance()
}
