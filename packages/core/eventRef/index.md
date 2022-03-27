---
category: Utilities
---

# eventRef

The Ref value get by event handler

## Usage

Scroll Top value reactive by window `scroll` event

```ts
import { eventRef } from '@vueuse/core'

const [scrollTop] = eventRef((handler) => {
  window.addEventListener('scroll', handler)
  return () => window.removeEventListener('scroll', handler)
}, () => window.pageYOffset ?? window.scrollY)
```

Scroll Top value reactive by window `scroll` event, and set by `window.scrollTo`

```ts
import { eventRef } from '@vueuse/core'

const [scrollTop] = eventRef((handler) => {
  window.addEventListener('scroll', handler)
  return () => window.removeEventListener('scroll', handler)
}, {
  get: () => window.pageYOffset ?? window.scrollY,
  set: val => window.scrollTo(val),
})
```

[Swiper.js](https://swiperjs.com/) reactive `activeIndex`

```ts
import Swiper from 'swiper'
import { eventRef } from '@vueuse/core'

const swiper = new Swiper('.swiper', {
  // ...
})

const [activeIndex] = eventRef((handler) => {
  swiper.on('activeIndexChange', handler)
  return () => swiper.off('activeIndexChange', handler)
}, {
  get: () => swiper.activeIndex, // current activeIndex
  set: val => swiper.slideTo(val), // call `slideTo(index)`
})
```
