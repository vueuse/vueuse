import type { WatchOptions, WatchSource } from 'vue-demi'
import { unref, watch } from 'vue-demi'

export declare type WatchListCallback<V = any, OV = any> = (value: V, oldValue: OV, added: V, removed: OV, onCleanup: (cleanupFn: () => void) => void) => any

export function watchListChanges<T, Immediate extends Readonly<boolean> = false>(source: WatchSource<T[]>, cb: WatchListCallback<T[], Immediate extends true ? T[] | undefined : T[]>, options?: WatchOptions<Immediate>) {
  let oldList: T[] = options?.immediate ? [] : [...(source instanceof Function ? source() : unref(source))]
  watch(source, (newList, _, onCleanup) => {
    const oldListRemains = new Array<boolean>(oldList.length)
    const added: T[] = []
    for (const obj of newList) {
      let found = false
      for (let i = 0; i < oldList.length; i++) {
        if (!oldListRemains[i] && obj === oldList[i]) {
          oldListRemains[i] = true
          found = true
          break
        }
      }
      if (!found)
        added.push(obj)
    }
    const removed = oldList.filter((_, i) => !oldListRemains[i])
    cb(newList, oldList, added, removed, onCleanup)
    oldList = [...newList]
  }, options)
}
