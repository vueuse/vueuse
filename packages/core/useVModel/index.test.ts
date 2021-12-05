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

  it('should work with arguments', () => {
    const props = {
      ...defaultProps(),
      data: 'data',
    }

    const data = useVModel(props, 'data')
    expect(data.value).toBe('data')
  })

  it('should emit on value change', async() => {
    const emitMock = sinon.spy()

    const data = useVModel(defaultProps(), undefined, emitMock)
    data.value = 'changed'

    expect(emitMock.lastCall.args[0]).toBe(isVue2 ? 'input' : 'update:modelValue')
    expect(emitMock.lastCall.args[1]).toBe('changed')
  })

  it('should use eventName if set', async() => {
    const emitMock = sinon.spy()

    const data = useVModel(defaultProps(), undefined, emitMock, { eventName: 'onChange' })
    data.value = 'changed'

    expect(emitMock.lastCall.args[0]).toBe('onChange')
  })

  it('should emit w/ passive', async() => {
    const emitMock = sinon.spy()

    const props = {
      ...defaultProps(),
      age: 18,
    }

    const data = useVModel(props, 'age', emitMock, { passive: true })
    data.value = 20

    await nextTick()

    expect(emitMock.lastCall.args[0]).toBe('update:age')
    expect(emitMock.lastCall.args[1]).toBe(20)
  })

  it('should emit w/ object props type', async() => {
    const emitMock = sinon.spy()

    const props = {
      ...defaultProps(),
      data: {
        age: 18,
      },
    }

    const data = useVModel(props, 'data', emitMock, { passive: true, deep: true })
    data.value.age = 20

    await nextTick()

    expect(emitMock.lastCall.args[0]).toBe('update:data')
    expect(emitMock).toBeCalledTimes(1)
    expect(emitMock.lastCall.args[1]).toEqual({ age: 20 })
  })

  it('should emit w/ array props type', async() => {
    const emitMock = sinon.spy()

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
    expect(emitMock.lastCall.args[0]).toBe('update:data')
    expect(emitMock.lastCall.args[1]).toEqual({ hobbies: ['coding', 'basketball'] })
  })
})
