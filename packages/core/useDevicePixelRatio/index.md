---
category: Sensors
---

# useDevicePixelRatio

Reactively track [`window.devicePixelRatio`](https://developer.mozilla.org/ru/docs/Web/API/Window/devicePixelRatio)
>
> NOTE: there is no event listener for `window.devicePixelRatio` change. So this function uses [`Testing media queries programmatically (window.matchMedia)`](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Testing_media_queries) as described in [this example](https://stackoverflow.com/questions/28905420/window-devicepixelratio-change-listener/29653772#29653772), but unlike the example this function subscribes to **several** pixelRatio scales (taken from [mydevice.io](https://www.mydevice.io/)) to detect any `window.devicePixelRatio` change.

## Usage

```js
import { useDevicePixelRatio } from '@vueuse/core'

export default {
  setup() {
    const { pixelRatio } = useDevicePixelRatio()

    return { pixelRatio }
  },
}
```

## Component

```html
<UseDevicePixelRatio v-slot="{ pixelRatio }">
  Pixel Ratio: {{ pixelRatio }}
</UseDevicePixelRatio>
```

<LearnMoreComponents />
