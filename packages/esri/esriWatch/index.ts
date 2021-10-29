import { Fn } from '@vueuse/core'
import { onScopeDispose } from 'vue-demi'

type EsriWatchCallback<T extends __esri.Accessor, K extends keyof T> = (newValue: T[K], oldValue: T[K], propertyName: K, target: T) => void

/**
 * Accessor's watch() in a scope lifecycle
 * @param accessor esri Accessor
 * @param property Accessor's property
 * @param fn callback
 * @param sync same as Accessor watch's sync parameter
 */
export function esriWatch<T extends __esri.Accessor, K extends keyof T>(accessor: T, property: K, fn: EsriWatchCallback<T, K>, sync?: boolean): Fn {
  const handle = accessor.watch(property as string, fn as Fn, sync)
  onScopeDispose(() => handle.remove())
  return () => handle.remove()
}
