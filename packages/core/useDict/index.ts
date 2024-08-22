export interface useDictItem {
  label: string
  value: string
}

export interface useDictData {
  [key: string]: useDictItem[]
}

/**
 * use dict helper function
 * @returns {getDictData, setDictData}
 */
export function useDictHelper() {
  const defaultDictSourceKey = 'use_dict_source_key'
  let dictDataCache: useDictData | null = null

  /**
   * Set global dict data
   * @param {useDictData} data - Dictionary data to set
   * @param {object} options - Optional parameters
   * @param {string} options.sourceKey - Custom key to store the dictionary data
   */
  function setDictData(data: useDictData, options?: {
    sourceKey?: string
  }) {
    const { sourceKey = defaultDictSourceKey } = options || {}
    try {
      localStorage.setItem('dict_source_global_key', sourceKey)
      localStorage.setItem(sourceKey, JSON.stringify(data))
      dictDataCache = data
    }
    catch (e) {
      console.error('Error setting dict data:', e)
    }
  }

  /**
   * Get global dict data
   * @returns {useDictData} - Retrieved dictionary data
   */
  function getDictData(): useDictData {
    if (dictDataCache)
      return dictDataCache

    try {
      const sourceKey = localStorage.getItem('dict_source_global_key') || defaultDictSourceKey
      const data = localStorage.getItem(sourceKey)
      if (data) {
        dictDataCache = JSON.parse(data) as useDictData
        return dictDataCache
      }
    }
    catch (e) {
      console.error('Error retrieving dict data:', e)
    }
    return {}
  }

  return {
    getDictData,
    setDictData,
  }
}

export function useDict(names: string | string[]) {
  const { getDictData } = useDictHelper()
  const dictData = getDictData()

  /**
   * Create a dictionary instance for the given name
   * @param {string} name - The name of the dictionary to create
   * @returns {object} - Dictionary object with various methods
   */
  const createDict = (name: string) => {
    const data = dictData[name] || []
    const keyValue = new Map(data.map(item => [item.label, item.value]))
    const valueKey = new Map(data.map(item => [item.value, item.label]))

    const mapValuesFromKeys = (
      input: string | string[],
      map: Map<string, string>,
    ): string[] => {
      const arrayInput = Array.isArray(input) ? input : input.split(',')
      return arrayInput.map(value => map.get(value)).filter(Boolean) as string[]
    }

    return {
      name,
      data,
      keyValue,
      valueKey,
      get() {
        return this.data
      },
      getValue(key: string) {
        return this.keyValue.get(key)
      },
      getKey(value: string) {
        return this.valueKey.get(value)
      },
      getKeys(values: string | string[]) {
        return mapValuesFromKeys(values, this.valueKey)
      },
      getValues(keys: string | string[]) {
        return mapValuesFromKeys(keys, this.keyValue)
      },
    }
  }

  const dictNames = Array.isArray(names) ? names : [names]
  return dictNames.map(createDict)
}
