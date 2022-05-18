// import { ref } from 'vue-demi'
export interface Props {
  duration?: number
  easingExpand?: string
  easingShrink?: string
  opacityClosed?: number
  opacityOpened?: number
}

export function useHeightTransition(propsUser?: Props) {
  // console.log(propsDefaults)
  const props: Props = {
    duration: 250,
    easingExpand: 'ease-in-out',
    easingShrink: 'ease-in-out',
    opacityClosed: 0,
    opacityOpened: 1,
  }

  Object.assign(props, propsUser)

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
    // const style = window.getComputedStyle(element, null)
    const style = element.style
    return {
      height: style.height,
      width: style.width,
      position: style.position,
      visibility: style.visibility,
      overflow: style.overflow,
      paddingTop: style.paddingTop,
      paddingBottom: style.paddingBottom,
      borderTopWidth: style.borderTopWidth,
      borderBottomWidth: style.borderBottomWidth,
      marginTop: style.marginTop,
      marginBottom: style.marginBottom,
    }
  }

  function getElementFullHeight(element: HTMLElement, initialStyle: initialStyle) {
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
    const keyframes = [
      {
        height: closed,
        opacity: props.opacityClosed,
        paddingTop: closed,
        paddingBottom: closed,
        borderTopWidth: closed,
        borderBottomWidth: closed,
        marginTop: closed,
        marginBottom: closed,
      },
      {
        height,
        opacity: props.opacityOpened,
        paddingTop: initialStyle.paddingTop,
        paddingBottom: initialStyle.paddingBottom,
        borderTopWidth: initialStyle.borderTopWidth,
        borderBottomWidth: initialStyle.borderBottomWidth,
        marginTop: initialStyle.marginTop,
        marginBottom: initialStyle.marginBottom,
      },
    ]
    // for (const key in initialStyle) {
    //   console.log(key)

    //   console.log(initialStyle[key])
    //   // if (initialStyle[key] === "") {
    //   //   delete keyframes[0][key]
    //   //   delete keyframes[1][key]
    //   // }
    // }
    return keyframes
  }

  function expandHeight(element: Element, done?: () => void) {
    const HTMLElement = element as HTMLElement
    const initialStyle = getElementStyle(HTMLElement)

    const height = getElementFullHeight(HTMLElement, initialStyle)
    const keyframes = getEnterKeyframes(height, initialStyle)

    const options = { duration: props.duration, easing: props.easingExpand }
    animateTransition(HTMLElement, initialStyle, keyframes, done, options)
  }

  function shrinkHeight(element: Element, done?: () => void) {
    const HTMLElement = element as HTMLElement
    const initialStyle = getElementStyle(HTMLElement)

    const { height } = getComputedStyle(HTMLElement)
    HTMLElement.style.height = height
    HTMLElement.style.overflow = 'hidden'
    const keyframes = getEnterKeyframes(height, initialStyle).reverse()

    const options = { duration: props.duration, easing: props.easingShrink }
    animateTransition(HTMLElement, initialStyle, keyframes, done, options)
  }

  return { expandHeight, shrinkHeight }
}
