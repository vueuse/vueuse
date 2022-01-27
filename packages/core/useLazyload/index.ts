
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

function preLoad(target: MaybeElementRef) {
  const el = unrefElement(target)
  if (!el) return
  const placeholder = el.getAttribute('data-placeholder-background')
  if (placeholder)
    el.style.background = placeholder
}
function load(target: MaybeElementRef) {
  const el = unrefElement(target)
  if (!el) return
  const src = el.getAttribute('data-src')
  const srcSet = el.getAttribute('data-srcset')
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
    if (shouldAppend) el.append(img)
  }
  if (src)
    el.setAttribute('src', src)
  if (srcSet)
    el.setAttribute('srcset', srcSet)
  if (backgroundImage)
    el.style.backgroundImage = `url(${backgroundImage})`
}
export function useLazyload(target: MaybeElementRef, options: LazyloadOptions = {}) {
  const { isSupported } = useIntersectionObserver(target, ([{ isIntersecting }]) => {
    if (isIntersecting) {
      preLoad(target)
      load(target)
    }
  }, options)
  if (!isSupported) {
    preLoad(target)
    load(target)
  }
}
