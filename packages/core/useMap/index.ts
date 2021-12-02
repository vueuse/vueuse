import { ref, computed, unref } from 'vue-demi'

/**
 * Use Map API More Easily.
 * @see https://vueuse.org/useMap
 * @param source
 * @param options
 */

export type MapKeys = string | number | Symbol
export type InitialMapType = Array<[unknown, unknown]> | Object

export function useMap<T extends InitialMapType>(initialMap?: T) {
  const map = ref(new Map())
  const size = computed(() => unref(map).size)
  const keys = computed(() => unref(map).keys())
  const values = computed(() => unref(map).values())

  const has = (key: MapKeys) => {
    return unref(map).has(key)
  }

  const get = (key: MapKeys) => {
    return unref(map).get(key)
  }

  const remove = (key?: MapKeys) => {
    key ? unref(map).delete(key) : unref(map).clear()
  }

  const set = (key: MapKeys, value: unknown) => {
    unref(map).set(key, value)
  }

  const setAll = (data: InitialMapType) => {
    if (Array.isArray(data)) {
      map.value = new Map(data)
    }
    else {
      remove()
      for (const key of Object.keys(data)) {
        const value = (data as any)[key]
        set(key, value)
      }
    }
  }
  const reset = () => {
    initialMap ? setAll(initialMap) : remove()
  }

  initialMap && setAll(initialMap)

  return {
    map,
    size,
    keys,
    values,
    has,
    get,
    set,
    setAll,
    remove,
    reset,
  }
}

export type UseMapReturn = ReturnType<typeof useMap>
