import { useSetup } from '../../.test'
import { useScriptTag } from '.'

describe('useScriptTag', () => {
  const src = 'https://code.jquery.com/jquery-3.5.1.min.js'

  const scriptTagElement = (): HTMLScriptElement | null =>
    document.head.querySelector(`script[src="${src}"]`)

  it('should add script tag', async () => {
    const appendChildListener = vitest.spyOn(document.head, 'appendChild')

    expect(appendChildListener).not.toBeCalled()

    expect(scriptTagElement()).toBeNull()

    useSetup(() => {
      const { scriptTag } = useScriptTag(src, () => {}, { immediate: true })

      return {
        scriptTag,
      }
    })

    expect(appendChildListener).toBeCalled()

    expect(scriptTagElement()).toBeInstanceOf(HTMLScriptElement)
  })

  it('should re-use the same src for multiple loads', async () => {
    const addChildListener = vitest.spyOn(document.head, 'appendChild')

    expect(addChildListener).not.toBeCalled()

    expect(scriptTagElement()).toBeNull()

    const vm = useSetup(() => {
      const script1 = useScriptTag(src, () => {}, { immediate: false, manual: true })
      const script2 = useScriptTag(src, () => {}, { immediate: false, manual: true })

      return {
        script1,
        script2,
      }
    })

    await vm.script1.load(false)
    await vm.script2.load(false)

    expect(vm.script1.scriptTag.value).not.toBeNull()
    expect(vm.script2.scriptTag.value).not.toBeNull()

    expect(addChildListener).toBeCalledTimes(1)
    expect(scriptTagElement()).toBeInstanceOf(HTMLScriptElement)
  })

  it('should support custom attributes', async () => {
    const appendChildListener = vitest.spyOn(document.head, 'appendChild')

    expect(appendChildListener).not.toBeCalled()

    expect(scriptTagElement()).toBeNull()

    useSetup(() => {
      const { scriptTag } = useScriptTag(src, () => {}, {
        attrs: { 'id': 'id-value', 'data-test': 'data-test-value' },
        immediate: true,
      })

      return {
        scriptTag,
      }
    })

    expect(appendChildListener).toBeCalled()

    const element = scriptTagElement()
    expect(element).toBeInstanceOf(HTMLScriptElement)
    expect(element?.getAttribute('id')).toBe('id-value')
    expect(element?.getAttribute('data-test')).toBe('data-test-value')
  })

  it('should remove script tag on unmount', async () => {
    const removeChildListener = vitest.spyOn(document.head, 'removeChild')

    expect(removeChildListener).not.toBeCalled()

    expect(scriptTagElement()).toBeNull()

    const vm = useSetup(() => {
      const { scriptTag, load, unload } = useScriptTag(src, () => {}, { immediate: false })

      return {
        scriptTag,
        load,
        unload,
      }
    })

    await vm.load(false)

    expect(scriptTagElement()).toBeInstanceOf(HTMLScriptElement)

    vm.unmount()

    expect(scriptTagElement()).toBeNull()

    expect(removeChildListener).toBeCalled()

    expect(vm.scriptTag).toBeNull()
  })

  it('should remove script tag on unload call', async () => {
    const removeChildListener = vitest.spyOn(document.head, 'removeChild')

    expect(removeChildListener).not.toBeCalled()

    expect(scriptTagElement()).toBeNull()

    const vm = useSetup(() => {
      const {
        scriptTag,
        load,
        unload,
      } = useScriptTag(src, () => {}, { immediate: false })

      return {
        scriptTag,
        load,
        unload,
      }
    })

    await vm.load(false)

    expect(scriptTagElement()).toBeInstanceOf(HTMLScriptElement)

    await vm.unload()

    expect(scriptTagElement()).toBeNull()

    expect(removeChildListener).toBeCalled()

    expect(vm.scriptTag).toBeNull()
  })

  it('should remove script tag on unload call after multiple loads', async () => {
    const removeChildListener = vitest.spyOn(document.head, 'removeChild')

    expect(removeChildListener).not.toBeCalled()

    expect(scriptTagElement()).toBeNull()

    const vm = useSetup(() => {
      const script1 = useScriptTag(src, () => {}, { immediate: false, manual: true })
      const script2 = useScriptTag(src, () => {}, { immediate: false, manual: true })

      return {
        script1,
        script2,
      }
    })

    // Multiple Loads
    await vm.script1.load(false)
    await vm.script2.load(false)

    expect(scriptTagElement()).toBeInstanceOf(HTMLScriptElement)

    vm.script1.unload()
    vm.script2.unload()

    expect(vm.script1.scriptTag.value).toBeNull()
    expect(vm.script2.scriptTag.value).toBeNull()
    expect(removeChildListener).toBeCalledTimes(1)
    expect(scriptTagElement()).toBeNull()
  })
})
