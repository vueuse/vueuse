import { nextTick, ref } from 'vue-demi'
import { useContextMenu } from '.'

describe('useContextMenu', () => {
  let menuRef = ref<HTMLElement>()
  let targetRef = ref<HTMLElement>()

  const contextMenuEvent = new MouseEvent('contextmenu', { clientX: 100, clientY: 200, bubbles: true })
  const clickOutside = () => dispatchEvent(new MouseEvent('click', { clientX: 9999, clientY: 9999, bubbles: true }))

  const expectToBeVisible = (element: HTMLElement) => expect(element.style.visibility).toBe('visible')
  const expectToBeHidden = (element: HTMLElement) => expect(element.style.visibility).toBe('hidden')

  beforeEach(() => {
    menuRef = ref(document.createElement('div'))
    document.body.append(menuRef.value!)
    targetRef = ref(document.createElement('div'))
    document.body.append(targetRef.value!)
  })
  afterEach(() => {
    document.body.innerHTML = ''
  })

  describe('basic functionality', () => {
    it('should effect "visible" state', () => {
      const { visible, hide, show } = useContextMenu(menuRef)
      expect(visible.value).toBe(false)
      show()
      expect(visible.value).toBe(true)
      hide()
      expect(visible.value).toBe(false)
    })

    it('should effect DOM visibility', async () => {
      const { visible } = useContextMenu(menuRef)

      visible.value = true
      await nextTick()
      expectToBeVisible(menuRef.value!)

      visible.value = false
      await nextTick()
      expectToBeHidden(menuRef.value!)
    })

    it('should be disabled', async () => {
      const { enabled } = useContextMenu(menuRef)

      expect(enabled.value).toBe(true)

      dispatchEvent(contextMenuEvent)
      await nextTick()
      expectToBeVisible(menuRef.value!)

      enabled.value = false
      await nextTick()
      expectToBeHidden(menuRef.value!)

      dispatchEvent(contextMenuEvent)
      await nextTick()
      expectToBeHidden(menuRef.value!)
    })

    it('should be invisible after clicking outside', async () => {
      useContextMenu(menuRef)

      dispatchEvent(contextMenuEvent)
      await nextTick()
      expectToBeVisible(menuRef.value!)

      clickOutside()
      await nextTick()
      expectToBeHidden(menuRef.value!)
    })

    it('should be hidden on scroll', async () => {
      useContextMenu(menuRef)

      dispatchEvent(contextMenuEvent)
      await nextTick()
      expectToBeVisible(menuRef.value!)

      window.dispatchEvent(new MouseEvent('scroll'))
      await nextTick()
      expectToBeHidden(menuRef.value!)
    })

    it('should be hidden when clicking on menu ', async () => {
      useContextMenu(menuRef)
      dispatchEvent(contextMenuEvent)
      await nextTick()
      expectToBeVisible(menuRef.value!)

      menuRef.value!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      await nextTick()
      expectToBeHidden(menuRef.value!)
    })

    it('should not be hidden when clicking on menu', async () => {
      useContextMenu(menuRef, { hideOnClick: false })

      dispatchEvent(contextMenuEvent)
      await nextTick()
      expectToBeVisible(menuRef.value!)

      menuRef.value!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      await nextTick()
      expectToBeVisible(menuRef.value!)
    })

    it('should permanently stopped', async () => {
      const { stop, show } = useContextMenu(menuRef)

      dispatchEvent(contextMenuEvent)
      await nextTick()
      expectToBeVisible(menuRef.value!)

      stop()
      await nextTick()
      expectToBeHidden(menuRef.value!)

      show()
      await nextTick()
      expectToBeHidden(menuRef.value!)
    })

    it('should trigger `onContextMenu` with exact Event', async () => {
      const receiveDOM = vi.fn()
      const onContextMenu = vi.fn((e: any) => {
        receiveDOM(e.target)
      })

      const subDiv = document.createElement('div')
      targetRef.value!.appendChild(subDiv)

      useContextMenu(menuRef, {
        target: targetRef,
        onContextMenu,
      })

      expect(onContextMenu).not.toBeCalled()

      targetRef.value!.dispatchEvent(contextMenuEvent)
      expect(receiveDOM).toBeCalledWith(targetRef.value)

      // exact DOM
      subDiv.dispatchEvent(contextMenuEvent)
      expect(receiveDOM).toBeCalledWith(subDiv)
    })

    it('should be prevented from showing', async () => {
      let prevent = false
      useContextMenu(menuRef, {
        onContextMenu: () => !prevent,
      })

      // not prevent
      dispatchEvent(contextMenuEvent)
      await nextTick()
      expectToBeVisible(menuRef.value!)

      // prevent
      prevent = true
      dispatchEvent(contextMenuEvent)
      await nextTick()
      expectToBeHidden(menuRef.value!)
    })
  })

  describe('given menu/target is a element', () => {
    it('should be applied globally', async () => {
      const menuELement = document.createElement('div')
      useContextMenu(menuELement)
      dispatchEvent(contextMenuEvent)
      await nextTick()
      expectToBeVisible(menuELement)
    })

    it('should be applied on target only', async () => {
      const menu = document.createElement('div')
      const target = document.createElement('div')
      useContextMenu(menu, { target })

      dispatchEvent(contextMenuEvent)
      await nextTick()
      expectToBeHidden(menu)

      target.dispatchEvent(contextMenuEvent)
      await nextTick()
      expectToBeVisible(menu)
    })
  })

  describe('given menu/target is a ref', () => {
    describe('given only menuRef', () => {
      it('should be applied globally', async () => {
        useContextMenu(menuRef)

        dispatchEvent(contextMenuEvent)
        await nextTick()
        expectToBeVisible(menuRef.value!)
      })
    })

    describe('given both menuRef & targetRef', () => {
      it('should be applied on target only', async () => {
        useContextMenu(menuRef, {
          target: targetRef,
        })

        dispatchEvent(contextMenuEvent)
        await nextTick()
        expectToBeHidden(menuRef.value!)

        targetRef.value!.dispatchEvent(contextMenuEvent)
        await nextTick()
        expectToBeVisible(menuRef.value!)
      })
    })

    describe('given both global & target only menu', () => {
      it('should have a higher priority for target only', async () => {
        const globalMenuRef = ref(document.createElement('div'))

        // global menu
        useContextMenu(globalMenuRef)
        // target only menu
        useContextMenu(menuRef, {
          target: targetRef,
        })

        targetRef.value!.dispatchEvent(contextMenuEvent)
        await nextTick()
        expectToBeVisible(menuRef.value!)
        expectToBeHidden(globalMenuRef.value!)

        dispatchEvent(contextMenuEvent)
        await nextTick()
        expectToBeVisible(globalMenuRef.value!)
        expectToBeHidden(menuRef.value!)

        clickOutside()
        await nextTick()
        expectToBeHidden(globalMenuRef.value!)
        expectToBeHidden(menuRef.value!)
      })
    })
  })
})
