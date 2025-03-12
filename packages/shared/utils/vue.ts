import { getCurrentInstance } from 'vue'

export function getLifeCycleTarget(target?: any) {
  return target || getCurrentInstance()
}
