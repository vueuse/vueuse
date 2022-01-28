import { promiseTimeout } from '@vueuse/shared'
import type { Ref } from 'vue-demi'
import { ref } from 'vue-demi'
import { onLongpress } from '.'

const pointerdownEvent = new PointerEvent('pointerdown')

describe('onLongpress', () => {
  let element: Ref<HTMLElement>

  beforeEach(() => {
    element = ref(document.createElement('div'))
  })

  it('should be defined', () => {
    expect(onLongpress).toBeDefined()
  })

  describe('given argument is ref', () => {
    describe('given no options', () => {
      it('should trigger longpress after 500ms', async() => {
        const onLongpressCallback = vi.fn()
        onLongpress(element, onLongpressCallback)
        element.value.dispatchEvent(pointerdownEvent)
        expect(onLongpressCallback).toHaveBeenCalledTimes(0)
        await promiseTimeout(500)
        expect(onLongpressCallback).toHaveBeenCalledTimes(1)
      })
    })

    describe('given options', () => {
      it('should trigger longpress after options.delay ms', async() => {
        const onLongpressCallback = vi.fn()
        onLongpress(element, onLongpressCallback, { delay: 1000 })
        element.value.dispatchEvent(pointerdownEvent)
        await promiseTimeout(500)
        expect(onLongpressCallback).toHaveBeenCalledTimes(0)
        await promiseTimeout(500)
        expect(onLongpressCallback).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('given argument is no ref', () => {
    describe('given no options', () => {
      it('should trigger longpress after 500ms', async() => {
        const onLongpressCallback = vi.fn()
        onLongpress(element.value, onLongpressCallback)
        element.value.dispatchEvent(pointerdownEvent)
        expect(onLongpressCallback).toHaveBeenCalledTimes(0)
        await promiseTimeout(500)
        expect(onLongpressCallback).toHaveBeenCalledTimes(1)
      })
    })

    describe('given options', () => {
      it('should trigger longpress after options.delay ms', async() => {
        const onLongpressCallback = vi.fn()
        onLongpress(element.value, onLongpressCallback, { delay: 1000 })
        element.value.dispatchEvent(pointerdownEvent)
        await promiseTimeout(500)
        expect(onLongpressCallback).toHaveBeenCalledTimes(0)
        await promiseTimeout(500)
        expect(onLongpressCallback).toHaveBeenCalledTimes(1)
      })
    })
  })
})
