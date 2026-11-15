import { describe, expect, it, vi } from 'vitest'
import { nextTick, reactive } from 'vue'
import { useVModels } from './index'

describe('useVModels', () => {
  it('should be defined', () => {
    expect(useVModels).toBeDefined()
  })

  it('should create refs for all props', () => {
    const props = {
      name: 'John',
      age: 25,
      isActive: true,
      score: 98.5,
    }

    const models = useVModels(props)

    expect(models.name.value).toBe('John')
    expect(models.age.value).toBe(25)
    expect(models.isActive.value).toBe(true)
    expect(models.score.value).toBe(98.5)
  })

  it('should work with empty object', () => {
    const props = {}
    const models = useVModels(props)

    expect(typeof models).toBe('object')
    expect(Object.keys(models)).toHaveLength(0)
  })

  it('should work with null and undefined values', () => {
    const props = {
      nullValue: null,
      undefinedValue: undefined,
    }

    const models = useVModels(props)

    expect(models.nullValue.value).toBe(null)
    expect(models.undefinedValue.value).toBe(undefined)
  })

  it('should work with nested objects', () => {
    const props = {
      user: { name: 'John', age: 25 },
      config: { theme: 'dark', lang: 'en' },
    }

    const models = useVModels(props)

    expect(models.user.value).toEqual({ name: 'John', age: 25 })
    expect(models.config.value).toEqual({ theme: 'dark', lang: 'en' })
  })

  it('should work with arrays', () => {
    const props = {
      items: ['apple', 'banana', 'orange'],
      numbers: [1, 2, 3],
    }

    const models = useVModels(props)

    expect(models.items.value).toEqual(['apple', 'banana', 'orange'])
    expect(models.numbers.value).toEqual([1, 2, 3])
  })

  it('should emit on value change', async () => {
    const emitMock = vi.fn()
    const props = {
      name: 'John',
      age: 25,
      isActive: true,
    }

    const models = useVModels(props, emitMock)

    models.name.value = 'Jane'
    models.age.value = 30
    models.isActive.value = false

    await nextTick()

    expect(emitMock).toHaveBeenCalledWith('update:name', 'Jane')
    expect(emitMock).toHaveBeenCalledWith('update:age', 30)
    expect(emitMock).toHaveBeenCalledWith('update:isActive', false)
    expect(emitMock).toHaveBeenCalledTimes(3)
  })

  it('should use custom eventName if provided', async () => {
    const emitMock = vi.fn()
    const props = {
      name: 'John',
      value: 'test',
    }

    const models = useVModels(props, emitMock, { eventName: 'onChange' })

    models.name.value = 'Jane'
    models.value.value = 'changed'

    await nextTick()

    expect(emitMock).toHaveBeenCalledWith('onChange', 'Jane')
    expect(emitMock).toHaveBeenCalledWith('onChange', 'changed')
    expect(emitMock).toHaveBeenCalledTimes(2)
  })

  it('should work with passive mode', () => {
    const emitMock = vi.fn()
    const props = {
      name: 'John',
      age: 25,
    }

    const models = useVModels(props, emitMock, { passive: true })

    models.name.value = 'Jane'
    models.age.value = 30

    // In passive mode, emit should not be called
    expect(emitMock).not.toHaveBeenCalled()

    // But values should still be updated
    expect(models.name.value).toBe('Jane')
    expect(models.age.value).toBe(30)
  })

  it('should work with clone option', () => {
    const originalUser = { name: 'John', age: 25 }
    const props = {
      user: originalUser,
    }

    const models = useVModels(props, undefined, { clone: true })

    // Should create a copy, not reference the same object
    expect(models.user.value).toEqual(originalUser)
    expect(models.user.value).not.toBe(originalUser)
  })

  it('should work with custom defaultValue', () => {
    const props = {
      name: undefined,
      age: undefined,
    }

    const models = useVModels(props, undefined, { defaultValue: 'default' })

    expect(models.name.value).toBe('default')
    expect(models.age.value).toBe('default')
  })

  it('should work with shouldEmit function', async () => {
    const emitMock = vi.fn()
    const shouldEmitMock = vi.fn().mockReturnValue(true)
    const props = {
      name: 'John',
      age: 25,
    }

    const models = useVModels(props, emitMock, { shouldEmit: shouldEmitMock })

    models.name.value = 'Jane'
    models.age.value = 30

    await nextTick()

    expect(shouldEmitMock).toHaveBeenCalledWith('Jane')
    expect(shouldEmitMock).toHaveBeenCalledWith(30)
    expect(emitMock).toHaveBeenCalledWith('update:name', 'Jane')
    expect(emitMock).toHaveBeenCalledWith('update:age', 30)
  })

  it('should not emit when shouldEmit returns false', async () => {
    const emitMock = vi.fn()
    const shouldEmitMock = vi.fn().mockReturnValue(false)
    const props = {
      name: 'John',
    }

    const models = useVModels(props, emitMock, { shouldEmit: shouldEmitMock })

    models.name.value = 'Jane'

    await nextTick()

    expect(shouldEmitMock).toHaveBeenCalledWith('Jane')
    expect(emitMock).not.toHaveBeenCalled()
  })

  it('should handle complex object mutations', async () => {
    const emitMock = vi.fn()
    const props = {
      user: { name: 'John', age: 25 },
      config: { theme: 'dark' },
    }

    const models = useVModels(props, emitMock)

    // Direct object replacement
    models.user.value = { name: 'Jane', age: 30 }
    // Property update
    models.config.value = { theme: 'light' }

    await nextTick()

    expect(emitMock).toHaveBeenCalledWith('update:user', { name: 'Jane', age: 30 })
    expect(emitMock).toHaveBeenCalledWith('update:config', { theme: 'light' })
  })

  it('should handle array mutations', async () => {
    const emitMock = vi.fn()
    const props = {
      items: ['apple', 'banana'],
      numbers: [1, 2, 3],
    }

    const models = useVModels(props, emitMock)

    models.items.value = ['orange', 'grape']
    models.numbers.value = [4, 5, 6]

    await nextTick()

    expect(emitMock).toHaveBeenCalledWith('update:items', ['orange', 'grape'])
    expect(emitMock).toHaveBeenCalledWith('update:numbers', [4, 5, 6])
  })

  it('should preserve reactivity for all props', async () => {
    const emitMock = vi.fn()
    const props = reactive({
      a: 1,
      b: 2,
      c: 3,
    })

    const models = useVModels(props, emitMock, { passive: true })

    // Change all values
    models.a.value = 10
    models.b.value = 20
    models.c.value = 30

    await nextTick()

    expect(models.a.value).toBe(10)
    expect(models.b.value).toBe(20)
    expect(models.c.value).toBe(30)
    expect(emitMock).toHaveBeenCalledTimes(3)
    expect(emitMock).toHaveBeenCalledWith('update:a', 10)
    expect(emitMock).toHaveBeenCalledWith('update:b', 20)
    expect(emitMock).toHaveBeenCalledWith('update:c', 30)
  })

  it('should work with mixed data types', () => {
    const props = {
      string: 'hello',
      number: 42,
      boolean: true,
      array: [1, 2, 3],
      object: { key: 'value' },
      nullValue: null,
      undefinedValue: undefined,
    }

    const models = useVModels(props)

    expect(models.string.value).toBe('hello')
    expect(models.number.value).toBe(42)
    expect(models.boolean.value).toBe(true)
    expect(models.array.value).toEqual([1, 2, 3])
    expect(models.object.value).toEqual({ key: 'value' })
    expect(models.nullValue.value).toBe(null)
    expect(models.undefinedValue.value).toBe(undefined)
  })

  it('should work without emit function', async () => {
    const props = reactive({
      name: 'John',
      age: 25,
    })

    // Provide a no-op emit function
    const noOpEmit = vi.fn()
    const models = useVModels(props, noOpEmit, { passive: true })

    expect(models.name.value).toBe('John')
    expect(models.age.value).toBe(25)

    // Should not throw error when changing values
    models.name.value = 'Jane'
    models.age.value = 30

    await nextTick()

    expect(models.name.value).toBe('Jane')
    expect(models.age.value).toBe(30)

    // The emit function should have been called
    expect(noOpEmit).toHaveBeenCalledTimes(2)
  })
})
