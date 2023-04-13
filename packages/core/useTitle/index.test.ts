import { computed, isReadonly, ref } from 'vue-demi'
import { useTitle } from '.'

describe('useTitle', () => {
  it('without param', () => {
    const title = useTitle()
    expect(title.value).toEqual('')
    title.value = 'new title'
    expect(title.value).toEqual('new title')
  })

  describe('with writable param', () => {
    it('string', () => {
      const title = useTitle('old title')
      expect(title.value).toEqual('old title')
      title.value = 'new title'
      expect(title.value).toEqual('new title')
    })

    it('null', () => {
      const title = useTitle(null)
      expect(title.value).toEqual('')
      title.value = 'new title'
      expect(title.value).toEqual('new title')
    })

    it('undefined', () => {
      const title = useTitle(undefined)
      expect(title.value).toEqual('')
      title.value = 'new title'
      expect(title.value).toEqual('new title')
    })

    describe('ref param', () => {
      it('string', () => {
        const targetRef = ref('old title')
        const title = useTitle(targetRef)
        expect(title.value).toEqual('old title')
        targetRef.value = 'new title'
        expect(title.value).toEqual('new title')
        title.value = 'latest title'
        expect(title.value).toEqual('latest title')
      })

      it('null', () => {
        const targetRef = ref<null | string>(null)
        const title = useTitle(targetRef)
        expect(title.value).toEqual(null)
        targetRef.value = 'new title'
        expect(title.value).toEqual('new title')
        title.value = 'latest title'
        expect(title.value).toEqual('latest title')
      })

      it('undefined', () => {
        const targetRef = ref<undefined | string>(undefined)
        const title = useTitle(targetRef)
        expect(title.value).toEqual(undefined)
        targetRef.value = 'new title'
        expect(title.value).toEqual('new title')
        title.value = 'latest title'
        expect(title.value).toEqual('latest title')
      })
    })
  })

  describe('with readonly param', () => {
    it('computed', () => {
      const condition = ref(false)
      const target = computed(() => condition.value ? 'new title' : 'old title')
      const title = useTitle(target)
      expect(title.value).toEqual('old title')
      condition.value = true
      expect(title.value).toEqual('new title')
      expect(isReadonly(title)).toBeTruthy()
    })

    it('function', () => {
      const target = () => 'new title'
      const title = useTitle(target)
      expect(title.value).toEqual('new title')
      expect(isReadonly(title)).toBeTruthy()
    })
  })
})
