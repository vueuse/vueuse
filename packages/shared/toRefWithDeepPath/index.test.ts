import { describe, expect, expectTypeOf, it } from 'vitest'
import { computed, ref as deepRef, nextTick, reactive, shallowRef, watchSyncEffect } from 'vue'
import { toRefWithDeepPath } from './index'

describe('toRefWithDeepPath', () => {
  it('should be defined', () => {
    expect(toRefWithDeepPath).toBeDefined()
  })

  it('reads and writes a nested property of a reactive object', () => {
    const user = reactive({
      infos: {
        fName: 'John',
      },
    })
    const fName = toRefWithDeepPath(user, ['infos', 'fName'])

    expect(fName.value).toBe('John')

    fName.value = 'Jane'

    expect(user.infos.fName).toBe('Jane')
    expect(fName.value).toBe('Jane')
    expectTypeOf(fName.value).toEqualTypeOf<string>()
  })

  it('follows a replaced intermediate object', () => {
    const user = reactive({
      infos: {
        fName: 'John',
      },
    })
    const fName = toRefWithDeepPath(user, ['infos', 'fName'])
    let seen = ''

    watchSyncEffect(() => {
      seen = fName.value
    })

    expect(seen).toBe('John')

    user.infos = { fName: 'Ada' }

    expect(fName.value).toBe('Ada')
    expect(seen).toBe('Ada')
  })

  it('reads and writes through a ref', () => {
    const state = deepRef({ count: 0 })
    const count = toRefWithDeepPath(state, ['count'])

    expect(count.value).toBe(0)
    expectTypeOf(count.value).toEqualTypeOf<number>()

    count.value++

    expect(state.value.count).toBe(1)

    state.value = { count: 4 }

    expect(count.value).toBe(4)
  })

  it('reads and writes through a getter', () => {
    const state = reactive({
      user: {
        name: 'John',
      },
    })
    const name = toRefWithDeepPath(() => state.user, ['name'])

    name.value = 'Jane'

    expect(state.user.name).toBe('Jane')

    state.user = { name: 'Ada' }

    expect(name.value).toBe('Ada')
  })

  it('does not create objects on read', () => {
    const user = reactive<{ infos?: { fName: string } }>({})
    const fName = toRefWithDeepPath(user, ['infos', 'fName'])

    expect(fName.value).toBeUndefined()
    expect(user.infos).toBeUndefined()
    expectTypeOf(fName.value).toEqualTypeOf<string | undefined>()
  })

  it('creates missing objects on write and keeps siblings', () => {
    const user = reactive<{ infos?: { fName?: string, lName?: string } }>({
      infos: { lName: 'Doe' },
    })
    const fName = toRefWithDeepPath(user, ['infos', 'fName'])

    fName.value = 'Jane'

    expect(user.infos).toEqual({ lName: 'Doe', fName: 'Jane' })
  })

  it('creates an array when the next key is a number', () => {
    const state = reactive<{ items?: { name: string }[] }>({})
    const name = toRefWithDeepPath(state, ['items', 0, 'name'])

    expect(name.value).toBeUndefined()
    expectTypeOf(name.value).toEqualTypeOf<string | undefined>()

    name.value = 'Ada'

    expect(state.items).toEqual([{ name: 'Ada' }])
  })

  it('throws when writing through null and leaves the source unchanged', () => {
    const user = reactive<{ infos: { fName: string } | null }>({ infos: null })
    const fName = toRefWithDeepPath(user, ['infos', 'fName'])

    expect(fName.value).toBeUndefined()
    expect(() => {
      fName.value = 'Jane'
    }).toThrowError(/null/)
    expect(user.infos).toBeNull()
  })

  it('throws when writing through a primitive', () => {
    const state = reactive({ box: 1 as number | { n: number } })

    // @ts-expect-error box is not always an object, so the next key is rejected
    const n = toRefWithDeepPath(state, ['box', 'n'])

    expect(() => {
      n.value = 2
    }).toThrowError(/number/)
    expect(state.box).toBe(1)
  })

  it('does not treat a value field as a ref', () => {
    const state = reactive({
      value: { n: 1 },
      name: 'John',
    })
    const name = toRefWithDeepPath(state, ['name'])

    expect(name.value).toBe('John')
    expectTypeOf(name.value).toEqualTypeOf<string>()
  })

  it('tracks a reactive source from a computed', async () => {
    const user = reactive({ infos: { fName: 'John' } })
    const fName = toRefWithDeepPath(user, ['infos', 'fName'])
    const upper = computed(() => fName.value.toUpperCase())

    expect(upper.value).toBe('JOHN')

    user.infos.fName = 'Ada'
    await nextTick()

    expect(upper.value).toBe('ADA')
  })

  it('keeps the first read of a plain object', () => {
    const user = { infos: { fName: 'John' } }
    const fName = toRefWithDeepPath(user, ['infos', 'fName'])

    expect(fName.value).toBe('John')

    user.infos.fName = 'Jane'

    expect(fName.value).toBe('John')
  })

  it('tracks replacement of a shallowRef and not its nested edits', () => {
    const state = shallowRef({ infos: { fName: 'John' } })
    const fName = toRefWithDeepPath(state, ['infos', 'fName'])

    expect(fName.value).toBe('John')

    state.value.infos.fName = 'Jane'

    expect(fName.value).toBe('John')

    state.value = { infos: { fName: 'Ada' } }

    expect(fName.value).toBe('Ada')
  })

  it('rejects an unknown key', () => {
    const user = reactive({ id: 1 })

    // @ts-expect-error name is not a key of user
    toRefWithDeepPath(user, ['name'])

    expect(user.id).toBe(1)
  })

  it('rejects a path longer than 6', () => {
    const state = reactive({ a: { b: { c: { d: { e: { f: { g: 1 } } } } } } })
    const six = toRefWithDeepPath(state, ['a', 'b', 'c', 'd', 'e', 'f'])

    expect(six.value.g).toBe(1)
    expectTypeOf(six.value).toEqualTypeOf<{ g: number }>()

    // @ts-expect-error paths are capped at 6 keys
    toRefWithDeepPath(state, ['a', 'b', 'c', 'd', 'e', 'f', 'g'])
  })
})
