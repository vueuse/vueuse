import { describe, expect, it } from 'vitest'
import { useDict, useDictHelper } from '.'

describe('useCounter', () => {
  it('should be defined', () => {
    expect(useDict).toBeDefined()
    expect(useDictHelper).toBeDefined()
  })

  it('should be set dict source', () => {
    const { setDictData, getDictData } = useDictHelper()
    const source = {
      status: [
        { label: '启用', value: '1' },
        { label: '关闭', value: '0' },
      ],
      gender: [
        { label: '男', value: '1' },
        { label: '女', value: '0' },
      ],
    }
    setDictData(source)
    expect(localStorage.getItem('dict_source_global_key')).toBe('use_dict_source_key')
    expect(localStorage.getItem('use_dict_source_key')).toBe(JSON.stringify(source))
    expect(getDictData()).toEqual(source)
  })

  it('should be dict methdos', () => {
    const { setDictData } = useDictHelper()
    const source = {
      status: [
        { label: '启用', value: '1' },
        { label: '关闭', value: '0' },
      ],
      gender: [
        { label: '男', value: '1' },
        { label: '女', value: '0' },
      ],
    }
    setDictData(source)

    const [statusDict, genderDict] = useDict(['status', 'gender'])

    expect(statusDict.get()).toEqual(source.status)
    expect(genderDict.getKey('0')).toBe('女')
    expect(statusDict.getValue('启用')).toBe('1')
    expect(genderDict.getValues('男,女')).toEqual(['1', '0'])
    expect(statusDict.getKeys('0,1')).toEqual(['关闭', '启用'])
  })
})
