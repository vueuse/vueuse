---
category: Browser
---

# usePreferredContrast

Reactive [prefers-contrast](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-contrast) media query.

## Usage

```js
import { usePreferredContrast } from '@vueuse/core'

const preferredContrast = usePreferredContrast()
```

## Component Usage

```html
<UsePreferredContrast v-slot="{ contrast }">
  Preferred Contrast: {{ contrast }}
</UsePreferredContrast>
```
