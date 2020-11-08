# useTransition

> Transition between values

## Usage

```js
import { useTransition } from '@vueuse/core'

useTransition(baseNumber, {
  duration: 1000,
  transition: 'easeInOutCubic',
})
```

The following transitions are available out of the box. Check out [easings.net](https://easings.net/en) for an example of each of these.

- `linear`
- `easeInSine`
- `easeOutSine`
- `easeInQuad`
- `easeOutQuad`
- `easeInCubic`
- `easeOutCubic`
- `easeInOutCubic`
- `easeInQuart`
- `easeOutQuart`
- `easeInOutQuart`
- `easeInQuint`
- `easeOutQuint`
- `easeInOutQuint`
- `easeInExpo`
- `easeOutExpo`
- `easeInOutExpo`
- `easeInCirc`
- `easeOutCirc`
- `easeInOutCirc`
- `easeInBack`
- `easeOutBack`
- `easeInOutBack`

Custom transitions can be provided as an array of numbers, or a custom function. For example, [`[0.75, 0, 0.25, 1]`](https://cubic-bezier.com/#.75,0,.25,1) would be an ease-in-out transition.
