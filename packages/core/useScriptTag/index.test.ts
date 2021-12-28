import { useSetup } from '../../.test'
import { useScriptTag } from '.'

describe('useScriptTag', () => {
  const src = 'https://code.jquery.com/jquery-3.5.1.min.js'

  const scriptTagElement = (): HTMLScriptElement | null =>
    document.head.querySelector(`script[src="${src}"]`)

  // Reset JSDOM after each test
  afterEach(() => {
    document.getElementsByTagName('html')[0].innerHTML
      = '<html><head></head><body>Empty DOM</body></html>'
  })

  it('should add script tag', async() => {
    const appendChildListener = jest.spyOn(document.head, 'appendChild')

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

  /**
   * @jest-environment jsdom
   */
  it('should remove script tag on unmount', async() => {
    const removeChildListener = jest.spyOn(document.head, 'removeChild')

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

  /**
   * @jest-environment jsdom
   */
  it('should remove script tag on unload after error', async() => {
    const removeChildListener = jest.spyOn(document.head, 'removeChild')

    expect(removeChildListener).not.toBeCalled()

    expect(scriptTagElement()).toBeNull()

    const vm = useSetup(() => {
      const { scriptTag, load, unload } = useScriptTag(src, () => {}, { immediate: false, manual: true })

      return {
        scriptTag,
        load,
        unload,
      }
    })

    await vm.load(false)

    expect(scriptTagElement()).toBeInstanceOf(HTMLScriptElement)

    vm.unload()

    expect(removeChildListener).toBeCalled()
    expect(vm.scriptTag).toBeNull()
    expect(scriptTagElement()).toBeNull()
  })

  /**
 * @jest-environment jsdom
 */
  it('should re-use the same src for multiple scripts', async() => {
    const removeChildListener = jest.spyOn(document.head, 'removeChild')

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

    await vm.script1.load(false)
    await vm.script2.load(false)

    expect(vm.script1.scriptTag.value).not.toBeNull()
    expect(vm.script2.scriptTag.value).not.toBeNull()

    expect(scriptTagElement()).toBeInstanceOf(HTMLScriptElement)
    expect(vm.script1.scriptTag).toEqual(vm.script2.scriptTag)

    expect(removeChildListener).not.toBeCalled()

    vm.script1.unload()
    vm.script2.unload()

    expect(removeChildListener).toBeCalledTimes(1)
    expect(vm.script1.scriptTag.value).toBeNull()
    expect(vm.script2.scriptTag.value).toBeNull()
    expect(scriptTagElement()).toBeNull()
  })

  it('should remove script tag on unload call', async() => {
    const removeChildListener = jest.spyOn(document.head, 'removeChild')

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
})
