import { isVue3, reactive, ref, computed } from 'vue-demi'
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

  it('should behave as vue\'s toRefs when a normal array was passed', () => {
    // FIXME: Vue 2 misalignment
    if (isVue3) {
      const arr = reactive(['a', 0])
      const refs = toRefs(arr)
      expect(refs[0].value).toBe('a')
      expect(refs[1].value).toBe(0)

      arr[0] = 'b'
      arr[1] = 1
      expect(refs[0].value).toBe('b')
      expect(refs[1].value).toBe(1)
    }
  })

  it('should return refs when a object ref was passed', () => {
    const obj = ref({ a: 'a', b: 0 })
    const refs = toRefs(obj)
    expect(refs.a.value).toBe('a')
    expect(refs.b.value).toBe(0)

    obj.value.a = 'b'
    obj.value.b = 1
    expect(refs.a.value).toBe('b')
    expect(refs.b.value).toBe(1)
  })

  it('should return refs when a array ref was passed', () => {
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
    const spy = jest.fn()
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
    expect(spy).toBeCalledWith({ a: 'b', b: 0 })

    refs.b.value = 1
    expect(spy).toBeCalledWith({ a: 'a', b: 1 })
  })

  it('should work correctly with writable computed arrays', () => {
    const spy = jest.fn()
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
    expect(spy).toBeCalledWith(['b', 0])

    refs[1].value = 1
    expect(spy).toBeCalledWith(['a', 1])
  })
})
