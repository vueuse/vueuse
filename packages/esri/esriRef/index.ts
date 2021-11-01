import { shallowRef, effectScope, watch } from 'vue-demi'
import { esriWatch } from '../esriWatch'

/**
 * create a ref var with Accessor's property
 * @param accessor esri Accessor
 * @param property Accessor's property
 */
export function esriRef <T extends __esri.Accessor, K extends keyof T>(accessor: T, property: K) {
  const watchRef = shallowRef(accessor[property])
  const scope = effectScope()
  scope.run(() => {
    esriWatch(accessor, property, (val) => {
      if (val !== watchRef.value)
        watchRef.value = val
    })
    watch(watchRef, (val) => {
      if (val !== accessor[property])
        accessor[property] = val
    })
  })
  return watchRef
}
