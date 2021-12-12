import { reactive } from 'vue-demi'

type CacheKey = any

/**
 * Interface for custom memoize cache handler
 */
export interface MemoizeCache<Key, Value> {
  // Get value for key
  get (key: Key): Value | undefined
  // Set value for key
  set (key: Key, value: Value): void
  // Return flag if key exists
  has (key: Key): boolean
  // Delete value for key
  delete (key: Key): void
  // Clear cache
  clear (): void
}

/**
 * Reactive function result cache based on arguments
 */
export const useMemoize = <Result, Args extends unknown[]> (
  resolver: (...args: Args) => Result,
  options?: {
    getKey?: (...args: Args) => CacheKey
    cache?: MemoizeCache<CacheKey, Result>
  },
) => {
  const cache = reactive(options?.cache || new Map<CacheKey, Result>())

  /**
   * Generate key from args
   */
  const generateKey = (...args: Args) => options?.getKey
    ? options.getKey(...args)
    // Default key: Serialize args
    : JSON.stringify(args)

  /**
   * Load data and save in cache
   */
  const _loadData = (key: CacheKey, ...args: Args): Result => {
    cache.set(key, resolver(...args))
    return cache.get(key) as Result
  }
  const loadData = (...args: Args): Result => _loadData(generateKey(...args), ...args)

  /**
   * Get data from cache or load if not cached
   */
  const getData = (...args: Args): Result => {
    // Get data from cache
    const key = generateKey(...args)
    if (cache.has(key)) return cache.get(key) as Result

    return _loadData(key, ...args)
  }

  /**
   * Delete key from cache
   */
  const deleteData = (...args: Args): void => {
    cache.delete(generateKey(...args))
  }

  /**
   * Clear cached data
   */
  const clearData = () => {
    cache.clear()
  }

  return {
    cache,
    get: getData,
    load: loadData,
    delete: deleteData,
    clear: clearData,
    generateKey,
  }
}
