# useFullscreen

> Reactive [Fullscreen API](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API). It adds methods to present a specific Element (and its descendants) in full-screen mode, and to exit full-screen mode once it is no longer needed. This makes it possible to present desired content—such as an online game—using the user's entire screen, removing all browser user interface elements and other applications from the screen until full-screen mode is shut off.

## Usage

```js
import { useFullscreen } from '@vueuse/core'

const { isFullscreen, enterFullscreen, exitFullscreen } = useFullscreen()
```
