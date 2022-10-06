import { nextTick } from 'vue-demi'
import { useElementVisibility } from '.'

describe('useElementVisibility', () => {
  let el: HTMLDivElement
  const overLeft = document.documentElement.clientWidth + 100
  const overTop = document.documentElement.clientHeight + 100
  const rect = {
    y: 0,
    bottom: 0,
    height: 0,
    left: 0,
    right: 0,
    top: 0,
    width: 0,
  } as DOMRect
  function scrollTrigger() {
    window.dispatchEvent(new Event('scroll'))
  }
  function mockGetBoundingClientRect(values: DOMRect[]) {
    const mocker = values.reduce((f, result) => f.mockReturnValueOnce(result), vi.fn())
    // prevent error when other tests trigger scroll
    mocker.mockImplementation(() => rect)
    return mocker
  }

  beforeEach(() => {
    el = document.createElement('div')
    window.innerWidth = document.documentElement.clientWidth
    window.innerHeight = document.documentElement.clientHeight
    document.body.appendChild(el)
  })

  it('should work when el is not an element', async () => {
    const visible = useElementVisibility(null)
    expect(visible.value).toBeFalsy()
    scrollTrigger()
    await nextTick()
    expect(visible.value).toBeFalsy()
  })

  it('should work when scrollY', async () => {
    el.getBoundingClientRect = mockGetBoundingClientRect([
      rect,
      { ...rect, top: overTop },
      rect,
      { ...rect, top: overTop },
    ])

    const visible = useElementVisibility(el)
    expect(visible.value).toBeTruthy()

    scrollTrigger()
    await nextTick()
    expect(visible.value).toBeFalsy()

    window.innerHeight = 0
    scrollTrigger()
    await nextTick()
    expect(visible.value).toBeTruthy()

    scrollTrigger()
    await nextTick()
    expect(visible.value).toBeFalsy()
  })

  it('should work when scrollX', async () => {
    el.getBoundingClientRect = mockGetBoundingClientRect([
      rect,
      { ...rect, left: overLeft },
      rect,
      { ...rect, left: overLeft },
    ])

    const visible = useElementVisibility(el)
    expect(visible.value).toBeTruthy()

    scrollTrigger()
    await nextTick()
    expect(visible.value).toBeFalsy()

    window.innerWidth = 0
    scrollTrigger()
    await nextTick()
    expect(visible.value).toBeTruthy()

    scrollTrigger()
    await nextTick()
    expect(visible.value).toBeFalsy()
  })

  it('should work when window is undefined', () => {
    // @ts-expect-error set window null
    const visible = useElementVisibility(el, { window: null })
    expect(visible.value).toBeFalsy()
  })
})
