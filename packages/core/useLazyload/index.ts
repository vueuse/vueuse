
import type { ConfigurableWindow } from '../_configurable'
import type { MaybeElementRef } from '../unrefElement'
import { unrefElement } from '../unrefElement'
import { useIntersectionObserver } from '../useIntersectionObserver'

export interface LazyloadOptions extends ConfigurableWindow{
  /**
   * The Element or Document whose bounds are used as the bounding box when testing for intersection.
   */
  root?: MaybeElementRef

  /**
   * A string which specifies a set of offsets to add to the root's bounding_box when calculating intersections.
   */
  rootMargin?: string

  /**
   * Either a single number or an array of numbers between 0.0 and 1.
   */
  threshold?: number | number[]
}

function load(target: MaybeElementRef) {
  const el = unrefElement(target)
  if (!el) return
  const src = el.getAttribute('data-src')
  const srcSet = el.getAttribute('data-srcset')
  const alt = el.getAttribute('data-alt')
  const backgroundImage = el.getAttribute('data-background-image')
  if (el.nodeName.toLowerCase() === 'picture') {
    let img = el.querySelector('img')
    let shouldAppend = false
    if (!img) {
      img = document.createElement('img')
      shouldAppend = true
    }
    if (src)
      img.setAttribute('src', src)
    if (alt)
      img.setAttribute('alt', alt)
    if (shouldAppend) el.append(img)
  }
  if (el.nodeName.toLowerCase() === 'video' && !src) {
    const children = el.children
    if (children) {
      for (let i = 0; i < children.length; i++) {
        const child = children[i]
        const childSrc = child.getAttribute('data-src')
        if (childSrc)
          child.setAttribute('src', childSrc)
      }
      (el as HTMLVideoElement).load()
    }
  }
  if (src)
    el.setAttribute('src', src)
  if (srcSet)
    el.setAttribute('srcset', srcSet)
  if (alt)
    el.setAttribute('alt', alt)
  if (backgroundImage)
    el.style.backgroundImage = `url(${backgroundImage})`
}
export function useLazyload(target: MaybeElementRef, options: LazyloadOptions = {}) {
  const { isSupported } = useIntersectionObserver(target, ([{ isIntersecting }]) => {
    if (isIntersecting)
      load(target)
  }, options)
  if (!isSupported)
    load(target)
}
