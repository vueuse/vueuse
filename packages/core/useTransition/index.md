# useTransition

> Transition between values

## Usage

```js
import { useTransition, TransitionPresets } from '@vueuse/core'

useTransition(baseNumber, {
  duration: 1000,
  transition: TransitionPresets.easeInOutCubic,
})
```

The following transitions are included as part of the `TransitionPresets` constant. See [easings.net](https://easings.net/en) for an example of each of these.

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

Custom transitions can be defined using [cubic bezier curves](https://cubic-bezier.com/#.75,0,.25,1).

```js
useTransition(baseNumber, {
  duration: 1000,
  transition: [0.75, 0, 0.25, 1],
})
```

For more complex transitions, a custom function can be provided.

```js
const easeOutElastic = (n) => {
  return n === 0
    ? 0
    : n === 1
      ? 1
      : (2 ** (-10 * n)) * Math.sin((n * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1
}

useTransition(baseNumber, {
  duration: 1000,
  transition: easeInOutElastic,
})
```
