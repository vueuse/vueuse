import { isVue2, nextTick } from 'vue-demi'
import { useSetup } from '../../.test'
import { useVModel } from '.'

describe('useVModel', () => {
  const defaultKey = isVue2 ? 'value' : 'modelValue'
  const defaultValue = 'default'
  const defaultProps = () => ({
    [defaultKey]: defaultValue,
  })

  const emitMock = jest.fn((event: string, values: any[]) => {})
  beforeEach(() => emitMock.mockClear())

  it('should work with default value', () => {
    useSetup(() => {
      const data = useVModel(defaultProps())
      expect(data.value).toBe(defaultValue)
    })
  })

  it('should work with arguments', () => {
    const props = {
      ...defaultProps(),
      data: 'data',
    }
    useSetup(() => {
      const data = useVModel(props, 'data')
      expect(data.value).toBe('data')
    })
  })

  it('should emit on value change', async() => {
    useSetup(() => {
      const data = useVModel(defaultProps(), undefined, emitMock)
      data.value = 'changed'
    })
    expect(emitMock.mock.calls[0][0]).toBe(isVue2 ? 'input' : 'update:modelValue')
    expect(emitMock.mock.calls[0][1]).toBe('changed')
  })

  it('should use eventName if set', async() => {
    useSetup(() => {
      const data = useVModel(defaultProps(), undefined, emitMock, { eventName: 'onChange' })
      data.value = 'changed'
    })

    expect(emitMock.mock.calls[0][0]).toBe('onChange')
  })

  it('should emit w/ passive', async() => {
    const props = {
      ...defaultProps(),
      age: 18,
    }
    useSetup(() => {
      const data = useVModel(props, 'age', emitMock, { passive: true })
      data.value = 20
    })

    await nextTick()

    expect(emitMock.mock.calls[0][0]).toBe('update:age')
    expect(emitMock.mock.calls[0][1]).toBe(20)
  })

  it('should emit w/ object props type', async() => {
    const props = {
      ...defaultProps(),
      data: {
        age: 18,
      },
    }
    useSetup(() => {
      const data = useVModel(props, 'data', emitMock, { passive: true, deep: true })
      data.value.age = 20
    })

    await nextTick()

    expect(emitMock.mock.calls[0][0]).toBe('update:data')
    expect(emitMock).toHaveBeenCalledTimes(1)
    expect(JSON.stringify(emitMock.mock.calls[0][1])).toBe(JSON.stringify({ age: 20 }))
  })

  it('should emit w/ array props type', async() => {
    const props = {
      ...defaultProps(),
      data: {
        hobbies: ['coding'],
      },
    }
    useSetup(() => {
      const data = useVModel(props, 'data', emitMock, { passive: true, deep: true })
      data.value.hobbies.push('basketball')
    })

    await nextTick()

    expect(emitMock.mock.calls[0][0]).toBe('update:data')
    expect(emitMock).toHaveBeenCalledTimes(1)
    expect(JSON.stringify(emitMock.mock.calls[0][1])).toBe(JSON.stringify({ hobbies: ['coding', 'basketball'] }))
  })
})
