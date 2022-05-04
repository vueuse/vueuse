import { isVue2, nextTick } from 'vue-demi'
import { useVModel } from '.'

describe('useVModel', () => {
  const defaultKey = isVue2 ? 'value' : 'modelValue'
  const defaultValue = 'default'
  const defaultProps = () => ({
    [defaultKey]: defaultValue,
  })

  it('should work with default value', () => {
    const data = useVModel(defaultProps())
    expect(data.value).toBe(defaultValue)
  })

  it('should work with boolean', () => {
    const data = useVModel({ [defaultKey]: false })
    expect(data.value).toBe(false)
  })

  it('should work with arguments', () => {
    const props = {
      ...defaultProps(),
      data: 'data',
    }

    const data = useVModel(props, 'data')
    expect(data.value).toBe('data')
  })

  it('should emit on value change', async () => {
    const emitMock = vitest.fn()

    const data = useVModel(defaultProps(), undefined, emitMock)
    data.value = 'changed'

    expect(emitMock).toHaveBeenCalledWith(isVue2 ? 'input' : 'update:modelValue', 'changed')
  })

  it('should use eventName if set', async () => {
    const emitMock = vitest.fn()

    const data = useVModel(defaultProps(), undefined, emitMock, { eventName: 'onChange' })
    data.value = 'changed'

    expect(emitMock).toHaveBeenCalledWith('onChange', 'changed')
  })

  it('should emit w/ passive', async () => {
    const emitMock = vitest.fn()

    const props = {
      ...defaultProps(),
      age: 18,
    }

    const data = useVModel(props, 'age', emitMock, { passive: true })
    data.value = 20

    await nextTick()

    expect(emitMock).toHaveBeenCalledWith('update:age', 20)
  })

  it('should emit w/ object props type', async () => {
    const emitMock = vitest.fn()

    const props = {
      ...defaultProps(),
      data: {
        age: 18,
      },
    }

    const data = useVModel(props, 'data', emitMock, { passive: true, deep: true })
    data.value.age = 20

    await nextTick()

    expect(emitMock).toHaveBeenCalledWith('update:data', { age: 20 })
  })

  it('should emit w/ array props type', async () => {
    const emitMock = vitest.fn()

    const props = {
      ...defaultProps(),
      data: {
        hobbies: ['coding'],
      },
    }

    const data = useVModel(props, 'data', emitMock, { passive: true, deep: true })
    data.value.hobbies.push('basketball')

    await nextTick()

    expect(emitMock).toBeCalledTimes(1)
    expect(emitMock).toHaveBeenCalledWith('update:data', { hobbies: ['coding', 'basketball'] })
  })

  it('should work with user define defaultValue', () => {
    const props = {
      ...defaultProps(),
    }
    const emitMock = vitest.fn()
    const data = useVModel(props, 'data', emitMock, { defaultValue: 'default-data' })
    expect(data.value).toBe('default-data')
  })

  it('should work with user define defaultValue with passive', () => {
    const props = {
      ...defaultProps(),
    }
    const emitMock = vitest.fn()
    const data = useVModel(props, 'data', emitMock, { passive: true, defaultValue: 'default-data' })
    expect(data.value).toBe('default-data')
  })
})
