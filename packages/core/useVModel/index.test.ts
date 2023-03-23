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

  it('should work with null', () => {
    const data = useVModel({ [defaultKey]: null })
    expect(data.value).toBe(null)
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
    const props: Record<string, unknown> = {
      ...defaultProps(),
      a: 0,
      b: '',
      c: false,
      d: null,
      e: undefined,
    }
    const emitMock = vitest.fn()

    const data = useVModel(props, 'data', emitMock, { defaultValue: 'default-data' })
    const dataA = useVModel(props, 'a', emitMock, { defaultValue: 'default-data' })
    const dataB = useVModel(props, 'b', emitMock, { defaultValue: 'default-data' })
    const dataC = useVModel(props, 'c', emitMock, { defaultValue: 'default-data' })
    const dataD = useVModel(props, 'd', emitMock, { defaultValue: 'default-data' })
    const dataE = useVModel(props, 'e', emitMock, { defaultValue: 'default-data' })

    expect(data.value).toBe('default-data')
    expect(dataA.value).toBe(0)
    expect(dataB.value).toBe('')
    expect(dataC.value).toBe(false)
    expect(dataD.value).toBe(null)
    expect(dataE.value).toBe('default-data')
  })

  it('should work with user define defaultValue with passive', () => {
    const props: Record<string, unknown> = {
      ...defaultProps(),
      a: 0,
      b: '',
      c: false,
      d: null as string | null,
      e: undefined as string | undefined,
    }
    const emitMock = vitest.fn()

    const data = useVModel(props, 'data', emitMock, { defaultValue: 'default-data', passive: true })
    const dataA = useVModel(props, 'a', emitMock, { defaultValue: 'default-data', passive: true })
    const dataB = useVModel(props, 'b', emitMock, { defaultValue: 'default-data', passive: true })
    const dataC = useVModel(props, 'c', emitMock, { defaultValue: 'default-data', passive: true })
    const dataD = useVModel(props, 'd', emitMock, { defaultValue: 'default-data', passive: true })
    const dataE = useVModel(props, 'e', emitMock, { defaultValue: 'default-data', passive: true })

    expect(data.value).toBe('default-data')
    expect(dataA.value).toBe(0)
    expect(dataB.value).toBe('')
    expect(dataC.value).toBe(false)
    expect(dataD.value).toBe(null)
    expect(dataE.value).toBe('default-data')
  })

  it('Should work with classes', async () => {
    const emitMock = vitest.fn()

    class SomeClass {
      num1 = 1

      someMethod() {}
    }

    const props = { cl: new SomeClass() }

    const ref = useVModel(props, 'cl', emitMock, { passive: true, deep: true })

    ref.value.num1 = 10

    await nextTick()

    const emitValue = (emitMock as any).calls[0][1]

    expect(emitValue instanceof SomeClass).toBeTruthy()
  })

  it('should clone object', async () => {
    const emitMock = vitest.fn()

    const props = {
      person: {
        age: 18,
        child: { age: 2 },
      },
    }

    const data = useVModel(props, 'person', emitMock, { passive: true, clone: true })
    const dataDeep = useVModel(props, 'person', emitMock, { passive: true, clone: true, deep: true })

    data.value.age = 20

    await nextTick()
    expect(props.person).not.toBe(data.value)
    expect(props.person).toEqual(expect.objectContaining({ age: 18 }))

    dataDeep.value.child.age = 3

    expect(props.person).not.toBe(dataDeep.value)
    expect(props.person).toEqual(expect.objectContaining({
      child: { age: 2 },
    }))
  })

  it('should deep clone object with clone function', async () => {
    const emitMock = vitest.fn()
    const clone = vitest.fn(x => JSON.parse(JSON.stringify(x)))

    const props = {
      person: {
        age: 18,
        child: { age: 2 },
      },
    }

    const data = useVModel(props, 'person', emitMock, { passive: true, clone, deep: true })

    data.value.age = 20
    data.value.child.age = 3

    await nextTick()
    expect(clone).toHaveBeenCalled()
    expect(props.person).not.toBe(data.value)
    expect(props.person).toEqual({
      age: 18,
      child: { age: 2 },
    })
  })

  it('should trigger beforeEmit', async () => {
    const emitMock = vitest.fn()
    const beforeEmitMock = vitest.fn()
    let res = ''
    const beforeEmit = (value: string) => {
      res = value
      beforeEmitMock()
      return true
    }
    const data = useVModel(defaultProps(), undefined, emitMock, { shouldEmit: beforeEmit })
    data.value = 'changed'

    expect(emitMock).toHaveBeenCalledWith(isVue2 ? 'input' : 'update:modelValue', 'changed')
    expect(beforeEmitMock).toHaveBeenCalled()
    await nextTick()
    expect(res).toBe('changed')
  })

  it('should not  trigger beforeEmit (return false)', async () => {
    const emitMock = vitest.fn()
    const beforeEmitMock = vitest.fn()
    let res = ''
    const beforeEmit = (value: string) => {
      res = value
      beforeEmitMock()
      return false
    }
    const data = useVModel(defaultProps(), undefined, emitMock, { shouldEmit: beforeEmit })
    data.value = 'changed'

    expect(emitMock).not.toHaveBeenCalled()
    expect(beforeEmitMock).toHaveBeenCalled()
    await nextTick()
    expect(res).toBe('changed')
  })
})
