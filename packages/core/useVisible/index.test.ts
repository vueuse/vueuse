import type { Ref } from 'vue-demi'
import { nextTick, ref } from 'vue-demi'
import { useVisible } from '.'

describe('useVisible', () => {
  it('should be defined', () => {
    expect(useVisible).toBeDefined()
  })

  describe('given argument is ref', () => {
    let element: Ref<HTMLElement>
    beforeEach(() => {
      element = ref(document.createElement('div'))
    })
    describe('given no initial value', () => {
      it('should initially be visible', async () => {
        const { visible } = useVisible(element)
        await nextTick()
        expect(visible.value).toEqual(true)
        expect(element.value.style.visibility).toEqual('visible')
      })

      it('should change the visibility', async () => {
        const { visible } = useVisible(element)
        await nextTick()
        expect(element.value.style.visibility).toEqual('visible')
        visible.value = false
        await nextTick()
        expect(element.value.style.visibility).toEqual('hidden')
      })
    })

    describe('given initial value', () => {
      it('should initially not be visible', async () => {
        const { visible } = useVisible(element, false)
        await nextTick()
        expect(visible.value).toEqual(false)
        expect(element.value.style.visibility).toEqual('hidden')
      })

      it('should change the visibility', async () => {
        const { visible } = useVisible(element, false)
        await nextTick()
        expect(element.value.style.visibility).toEqual('hidden')
        visible.value = true
        await nextTick()
        expect(element.value.style.visibility).toEqual('visible')
      })
    })
  })

  describe('given argument is no ref', () => {
    let element: HTMLElement
    beforeEach(() => {
      element = document.createElement('div')
    })
    describe('given no initial value', () => {
      it('should initially be visible', async () => {
        const { visible } = useVisible(element)
        await nextTick()
        expect(visible.value).toEqual(true)
        expect(element.style.visibility).toEqual('visible')
      })

      it('should change the visibility', async () => {
        const { visible } = useVisible(element)
        await nextTick()
        expect(element.style.visibility).toEqual('visible')
        visible.value = false
        await nextTick()
        expect(element.style.visibility).toEqual('hidden')
      })
    })

    describe('given initial value', () => {
      it('should initially not be visible', async () => {
        const { visible } = useVisible(element, false)
        await nextTick()
        expect(visible.value).toEqual(false)
        expect(element.style.visibility).toEqual('hidden')
      })

      it('should change the visibility', async () => {
        const { visible } = useVisible(element, false)
        await nextTick()
        expect(element.style.visibility).toEqual('hidden')
        visible.value = true
        await nextTick()
        expect(element.style.visibility).toEqual('visible')
      })
    })
  })
})
