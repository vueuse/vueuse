// import { ref } from 'vue-demi'
interface Props {
  duration?: number
  easingEnter?: string
  easingLeave?: string
  opacityClosed?: number
  opacityOpened?: number
}

export function useHeightTransition(props?: Props) {
  // console.log(propsDefaults)
  const propsDefaults: Props = {
    duration: 1250,
    easingEnter: 'ease-in-out',
    easingLeave: 'ease-in-out',
    opacityClosed: 0,
    opacityOpened: 1,
  }

  Object.assign(propsDefaults, props)

  const closed = '0px'

  interface initialStyle {
    height: string
    width: string
    position: string
    visibility: string
    overflow: string
    paddingTop: string
    paddingBottom: string
    borderTopWidth: string
    borderBottomWidth: string
    marginTop: string
    marginBottom: string
  }

  function getElementStyle(element: HTMLElement) {
    return {
      height: element.style.height,
      width: element.style.width,
      position: element.style.position,
      visibility: element.style.visibility,
      overflow: element.style.overflow,
      paddingTop: element.style.paddingTop,
      paddingBottom: element.style.paddingBottom,
      borderTopWidth: element.style.borderTopWidth,
      borderBottomWidth: element.style.borderBottomWidth,
      marginTop: element.style.marginTop,
      marginBottom: element.style.marginBottom,
    }
  }

  function prepareElement(element: HTMLElement, initialStyle: initialStyle) {
    const { width } = getComputedStyle(element)
    element.style.width = width
    element.style.position = 'absolute'
    element.style.visibility = 'hidden'
    element.style.height = ''
    const { height } = getComputedStyle(element)
    element.style.width = initialStyle.width
    element.style.position = initialStyle.position
    element.style.visibility = initialStyle.visibility
    element.style.height = closed
    element.style.overflow = 'hidden'
    return initialStyle.height && initialStyle.height !== closed
      ? initialStyle.height
      : height
  }

  function animateTransition(
    element: HTMLElement,
    initialStyle: initialStyle,
    keyframes: Keyframe[] | PropertyIndexedKeyframes | null,
    done?: () => void,
    options?: number | KeyframeAnimationOptions,
  ) {
    const animation = element.animate(keyframes, options)
    // Set height to 'auto' to restore it after animation
    element.style.height = initialStyle.height
    animation.onfinish = () => {
      element.style.overflow = initialStyle.overflow
      if (done)
        done()
    }
  }

  function getEnterKeyframes(height: string, initialStyle: initialStyle) {
    return [
      {
        height: closed,
        opacity: propsDefaults.opacityClosed,
        paddingTop: closed,
        paddingBottom: closed,
        borderTopWidth: closed,
        borderBottomWidth: closed,
        marginTop: closed,
        marginBottom: closed,
      },
      {
        height,
        opacity: propsDefaults.opacityOpened,
        paddingTop: initialStyle.paddingTop,
        paddingBottom: initialStyle.paddingBottom,
        borderTopWidth: initialStyle.borderTopWidth,
        borderBottomWidth: initialStyle.borderBottomWidth,
        marginTop: initialStyle.marginTop,
        marginBottom: initialStyle.marginBottom,
      },
    ]
  }

  function expandHeight(element: Element, done: () => void) {
    const HTMLElement = element as HTMLElement
    // console.log(HTMLElement)
    const initialStyle = getElementStyle(HTMLElement)
    const height = prepareElement(HTMLElement, initialStyle)
    const keyframes = getEnterKeyframes(height, initialStyle)
    const options = { duration: propsDefaults.duration, easing: propsDefaults.easingEnter }
    animateTransition(HTMLElement, initialStyle, keyframes, done, options)
  }

  function shrinkHeight(element: Element, done?: () => void) {
    const HTMLElement = element as HTMLElement
    const initialStyle = getElementStyle(HTMLElement)
    const { height } = getComputedStyle(HTMLElement)
    HTMLElement.style.height = height
    HTMLElement.style.overflow = 'hidden'
    const keyframes = getEnterKeyframes(height, initialStyle).reverse()
    const options = { duration: propsDefaults.duration, easing: propsDefaults.easingLeave }
    animateTransition(HTMLElement, initialStyle, keyframes, done, options)
  }

  return { expandHeight, shrinkHeight }
}
