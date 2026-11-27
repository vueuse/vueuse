---
category: Browser
---

# usePreload

Preload resources required for the current page

## Usage

```js {3}
import { usePreload } from '@vueuse/core'

// preload style
usePreload('https://example.com/style.css', { as: 'style' });

// preload script
usePreload('https://example.com/js.js', { as: 'script' });

// preload font
usePreload('https://example.com/font.woff2', { as: 'font' });

// preload image with crossorigin
usePreload('https://example.com/image.jpg', {
  as: 'image',
  crossOrigin: 'anonymous'
});
```
