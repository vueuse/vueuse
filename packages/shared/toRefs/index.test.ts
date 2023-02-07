import { computed, isVue3, reactive, ref } from 'vue-demi'
import { toRefs } from '.'

describe('toRefs', () => {
  it('should be defined', () => {
    expect(toRefs).toBeDefined()
  })

  it('should behave as vue\'s toRefs when a normal object was passed', () => {
    const obj = reactive({ a: 'a', b: 0 })
    const refs = toRefs(obj)
    expect(refs.a.value).toBe('a')
    expect(refs.b.value).toBe(0)

    obj.a = 'b'
    obj.b = 1
    expect(refs.a.value).toBe('b')
    expect(refs.b.value).toBe(1)
  })

  // FIXME: Vue 2 misalignment
  it.runIf(isVue3)('should behave as vue\'s toRefs when a normal array was passed', () => {
    const arr = reactive(['a', 0])
    const refs = toRefs(arr)
    expect(refs[0].value).toBe('a')
    expect(refs[1].value).toBe(0)

    arr[0] = 'b'
    arr[1] = 1
    expect(refs[0].value).toBe('b')
    expect(refs[1].value).toBe(1)
  })

  it('should return refs when an object ref was passed', () => {
    const obj = ref({ a: 'a', b: 0 })
    const refs = toRefs(obj)
    expect(refs.a.value).toBe('a')
    expect(refs.b.value).toBe(0)

    obj.value.a = 'b'
    obj.value.b = 1
    expect(refs.a.value).toBe('b')
    expect(refs.b.value).toBe(1)
  })

  it('should return refs when an array ref was passed', () => {
    const arr = ref(['a', 0])
    const refs = toRefs(arr)
    expect(refs[0].value).toBe('a')
    expect(refs[1].value).toBe(0)

    arr.value[0] = 'b'
    arr.value[1] = 1
    expect(refs[0].value).toBe('b')
    expect(refs[1].value).toBe(1)
  })

  it('should work correctly with writable computed objects', () => {
    const spy = vitest.fn()
    const obj = computed<{ a: string; b: number }>({
      get() {
        return { a: 'a', b: 0 }
      },
      set(v) {
        spy(v)
      },
    })
    const refs = toRefs(obj)
    expect(refs.a.value).toBe('a')
    expect(refs.b.value).toBe(0)

    refs.a.value = 'b'
    expect(spy).toHaveBeenLastCalledWith({ a: 'b', b: 0 })

    refs.b.value = 1
    expect(spy).toHaveBeenLastCalledWith({ a: 'a', b: 1 })
  })

  it('should work correctly with writable computed arrays', () => {
    const spy = vitest.fn()
    const arr = computed<any[]>({
      get() {
        return ['a', 0]
      },
      set(v) {
        spy(v)
      },
    })
    const refs = toRefs(arr)
    expect(refs[0].value).toBe('a')
    expect(refs[1].value).toBe(0)

    refs[0].value = 'b'
    expect(spy).toHaveBeenLastCalledWith(['b', 0])

    refs[1].value = 1
    expect(spy).toHaveBeenLastCalledWith(['a', 1])
  })

  it('should save instance of class', () => {
    class SomeClass {
      v = 1

      fn() {

      }
    }

    const obj = ref(new SomeClass())

    const { v } = toRefs(obj)

    v.value = 10

    expect(obj.value instanceof SomeClass).toBeTruthy()
  })
})
