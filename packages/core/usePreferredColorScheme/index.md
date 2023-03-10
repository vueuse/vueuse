---
category: Browser
---

# usePreferredColorScheme

Reactive [prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme) media query.

## Usage

```js
import { usePreferredColorScheme } from '@vueuse/core'

const preferredColor = usePreferredColorScheme()
```

## Component Usage

```html
<UsePreferredColorScheme v-slot="{ colorScheme }">
  Preferred Color Scheme: {{ colorScheme }}
</UsePreferredColorScheme>
```
